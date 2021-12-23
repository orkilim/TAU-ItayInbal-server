const fs = require('fs');
const Config = require('./models/configuration')
const mongoose = require('mongoose');
require("dotenv").config();//required to access the .env contents
const url=process.env.DB_URL


/**
 * connection to MongoDB through the MongoClient- done for specific action not available directly through 
 * the Mongoose npm, such as adding a new collection 
 */
const MongoClient = require('mongodb').MongoClient;


/**
 * a function that saves configurations to a form created and sent by the researcher in the DB:
 * gets:
 * 
 * the function receives inside the body of "req" variable (req.body) the following:
 * -schema: Object, required. the schema of the form, that defines which fields will be in the form.
 * 
 * -ui: Object, optional. the ui configuration of the schema, that defines how the schema will look like in terms of limitations and tools (checkboxes, radiobuttons, number of rows for a specific input
 * a limit of min and max to some inputs and more)
 * 
 * -name: String, required. the name of the form/research, the name which will than become the name of the collection in the formcreator database 
 * which under all the answers from the participants will be saved. 
 * 
 * 
 * returns: 
 * 
 * upon SUCCESSFUL execution: status 200 and a url (link) to send to participants which will return the form the researcher
 * configured and that can actually save answers to the specified collection (specified collection=name of research/form in the form creator database)
 * 
 * the link/url is a string
 * 
 * possible error/other status codes: 
 * 
 * 201: NOT an error- a collection (research/form) already exists with the chosen name (req.body.name)
 * 
 * 500: name or schema were NOT received in req.body i.e in the request to the server
 * 
 * 501: could not connect to the mongoDB and the formcreator database via MongoClient. reason specified in err variable
 * 
 * 502: could not create a collection with MongoClient. reason specified in err variable
 * 
 * 503: could not save form configuration to formcreator database OR save was not successful.
 * 
 * 504: a general error. reason specified in error variable
 */
const createForm = async (req, res, next) => {

    const uihost=req.body.uihost
    const schema = req.body.schema
    const ui = req.body.ui
    const name = req.body.name
    if (name == null || schema == null) {
        console.log("name or schema are null")
        return res.status(500).send("name or schema are null")
    }
    //create a string for the link in the format of: http://localhost:3000/forms/name-of-research
    const nameForLink = name.replace(/ /g, "-")

    try {

        const link = `http://${uihost}/forms/${nameForLink}`

        //creating a configuration for form to go to Configurations collection in MongoDB
        const config = new Config({ name, schema, ui, link })
        const result = await Config.findOne({ name: name })
        if (result) {
            return res.status(201).send("a form with that name already exists")
        }
        //creating a connection to create a new collection that will have the name of the research/experiment
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.log("can't connect")
                db.close()
                return res.status(501).send("err in MongoClient.connect is: ", err);
            }
            const formcreatorDB = db.db("formcreator");
            formcreatorDB.createCollection(`${name}`, function (err, res) {
                if (err)
                    return res.status(502).send("err in dbo.createCollection is: ", err);
                db.close();
            });
        })

        //saving the configutarion to Configurations collection
        const didSave = await config.save()
        if (didSave) {
            const objSentToClient = {
                msg: "new configuration for form created successfully",
                link: link
            }
            res.status(200).json(objSentToClient)
        }
        else {
            return res.status(503).send("problem with saving the configuration")
        }

    } catch (error) {
        if (error) {
            console.log("error in createForm is: ", error)
            res.status(504).send("error in createForm is: ", error)
        }
    }

}


/**
 * a function that retrieves the form CONFIGURATION  from the Configurations collection in the formcreator database 
 * specified in the name gotten in req.query.name
 * 
 * uses query-STRING
 * 
 * IMPORTANT!!!: name of researchs/forms are CASE SENSITIVE!!!!
 * 
 * gets: 
 * 
 * -title: string, required. title of research/form (req.query.title), same one we got in req.body.name in createForm
 * 
 * returns:
 * 
 * upon SUCCESSFUL execution: status 200 and the schema and ui-schema that will create the form in the UI side in the <Form /> component
 * 
 * -schema&ui-schema: both are objects (same structure as the schema and ui-schema of createForm)
 * 
 * errors and their status codes: 
 * 
 * 500: title of research/form is missing/null
 * 
 * 501: could not find a configuration (document in the Configurations collection in the formcreator database in MongoDB) that
 * matches the name stated
 * 
 * 502: general error
 * 
 */

const getForm = (req, res, next) => {


    const title = req.query.title //title(/name) of the research

    if (title == null)
        return res.status(500).send("title is null")
    try {
        //check if the wanted form even exists
        Config.findOne({ name: title.replace(/-/g, " ") }, (err, data) => {
            if (err) {
                console.log("error in getForms is: ", err)
                return res.status(501).send("error in getForm in readdir is: ", err)
            }


            let objSentToClient = {
                schema: data.schema,
                UI: data.ui,
                nameOfCollection: title.replace(/-/g, " ")
            }
            //returning the form's data and configuration
            return res.status(200).send(objSentToClient)



        })
    } catch (error) {
        if (error) {
            console.log("error in getForms is: ", err)
            res.status(502).send("error in getForms is: ", err)
        }
    }
}


/**
 * a function that saves a participant's answers after they submitted them in the form they got from getForm. saves the 
 * answers inside the collection name which corresponds to the name of the form/research they answered
 * with the time and date they were answered at (the time and date=metadata. it is added automatically by the server) 
 * 
 * gets:
 * 
 * -name: string, required. inside the body of the req variable (=req.body) "name" specifies which collection 
 * we are referring to, the name of the form/research is the name of the collection.
 * 
 * returns:
 * 
 * upon SUCCESSFUL execution: status 200 and a success message (a success alert prompts in the UI side as well)
 * 
 * error status codes and their meaning: 
 * 
 * 500: name of collection is null or missing.
 * 
 * 501: there was a problem in connecting to MongoDB or formcreator database via MongoClient
 * 
 * 502: there was a problem in creating a new document in the collection specificied.
 * 
 * 503: a general problem
 * 
 * 
 */

const saveAnswers = (req, res) => {

    const nameOfCollection = req.body.name //name of collection (same as research name) with which we want to work

    if (nameOfCollection == null) {
        return res.status(500).send("name of collection is missing or null")
    }
    try {
        //adding time and date
        const dateObj = new Date()
        const date = `${dateObj.getDate()}-${(dateObj.getMonth()) + 1}-${dateObj.getFullYear()}`
        const time=`${dateObj.getHours()}:${dateObj.getMinutes()}`
        const answersSavedInDB = {
            data: req.body.answers, //the answers themselves
            metadata: {
                date:date,
                time:time
            } /**time and date. format: date: day-month-year,
                *time: hours:minutes*/
        };

        MongoClient.connect(url, function (err, db) {

            if (err) {
                console.log("error in MongoClient.connect in saveAnswers is: ", err)
                db.close()
                return res.status(501).send("error in MongoClient.connect in saveAnswers is: ", err)
            }
            const formcreatorDB = db.db("formcreator");
            //saving answers to desired collection
            formcreatorDB.collection(`${nameOfCollection}`).insertOne(answersSavedInDB, function (err, response) {
                if (err) {
                    console.log("error in dbo.collection or in insertOne in saveAnswers is: ", err)
                    db.close()
                    return res.status(502).send("error in dbo.collection or in insertOne in saveAnswers is: ", err)
                }
                db.close();
            });
        });

        return res.status(200).send("answers saved successfully")
    }catch(err){
        console.log(err)
        return res.status(503).send(err)
    }
}


/**
 * 
 * a function call that retrieves ALL the results/answers of a specific form/research whose 
 * name is specified in req.query.name
 * 
 * uses query-STRING 
 * 
 * gets:
 * 
 * -name: string, required. inside req.query.name you get the name of the research/form for which we need the results 
 * of the participants
 * 
 * returns:
 * 
 * upon SUCCESSFUL execution: status 200 and ALL the results for the specified research/form
 * 
 * -results: object
 * 
 * contains the results and metadata (time and date)
 * 
 * error codes and their meaning:
 * 
 * 500: name of collection is missing or null
 * 
 * 501: there was a problem in connecting to MongoDB or formcreator database via MongoClient
 * 
 * 502: there was a problem finding the collection specified or retrieveing the results from it
 * 
 * 503: general problem
 */

const getAnswers = (req, res) => {
    const nameOfCollection = req.query.name //name of collection (same as research name) with which we want to work

    if(nameOfCollection==null)
    {
        return res.status(500).send("name of collection is missing or null")
    }
    try {

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("error in MongoClient.connect in getAnswers is: ", err)
                db.close()
                return res.status(501).send("error in MongoClient.connect in getAnswers is: ", err)
            }
            const formcreatorDB = db.db("formcreator"); //connecting to database in the nme of formcreator- our database

            //retrieving results from the desired collection
            formcreatorDB.collection(`${nameOfCollection}`).find({}).toArray(function (err, results) {
                if (err) {
                    console.log("err in dbo.collectio.find in getAnswers is: ", err)
                    return res.status(502).send("err in dbo.collectio.find in getAnswers is: ", err)
                }
                db.close();
                const resultsJSON={
                    results:results
                }
                
                return res.status(200).send(resultsJSON)
            });
        });
    } catch (error) {
        if (error) {
            console.log("error in getAnswers is: ", error)
            return res.status(503).send("error in getAnswers is: ", error)
        }
    }
}
/**
 * a function to get all the names of collections from the formcreator database
 * 
 * gets: nothing
 * 
 * returns: inside the "info" object. there will be the names of all the collections of the database
 * 
 * upon SUCCESSFUL execution: status 200 and the names of all the collections in the database
 * 
 * other status codes and their meanings: 
 * 
 * 501: problem with connection
 * 
 * 502: problem with retrieving all the collections
 * 
 * 503: general problem
 */
const getNames=(req,res)=>{
    try {
        MongoClient.connect(url,(err,db)=>{
            if(err)
            {
                console.log("problem with connection: ",err)
                db.close()
                return res.status(501).send("problem with connection: ",err)
            }
            const formcreatorDB=db.db("formcreator")

            formcreatorDB.listCollections().toArray((err,info)=>{
                if(err)
                {
                    console.log("problem in listCollections: ",err)
                    db.close()
                    return res.status(502).send("problem in listCollections: ",err)
                }
                db.close()
                return res.status(200).send(info)
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(503).send("general problem in getNames: ",error)
    }
}

const test=(req,res)=>{
    res.status(200).send("server is up and running")
}

module.exports = { createForm, getForm, saveAnswers, getAnswers,test,getNames }


