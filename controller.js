const fs = require('fs');
const Config = require('./models/configuration')
const mongoose = require('mongoose');
const {url,host,path}=require('./consts')
/**
 * connection to MongoDB through the MongoClient- done for specific action not available directly through 
 * the Mongoose npm, such as adding a new collection 
 */
const MongoClient = require('mongodb').MongoClient;



const createForm = async (req, res, next) => {

    const schema = req.body.schema
    const ui = req.body.ui
    const name = req.body.name
    if(name==null||schema==null)
    {
        console.log("name or schema are null")
        return res.status(500).send("name or schema are null")
    }
    //create a string for the link in the format of: http://localhost:3000/forms/name-of-research
    const nameForLink = name.replace(/ /g, "-")
    console.log("this will go to link: ", nameForLink)
    try {
        
        const link = `http://${host}/forms/${nameForLink}`

        //creating a configuration for form to go to Configurations collection in MongoDB
        const config = new Config({ name, schema,ui, link })
        const result = await Config.findOne({ name: name })
        if (result) {
            return res.status(201).send("a form with that name already exists")
        }
        //creating a connection to create a new collection that will have the name of the research/experiment
        MongoClient.connect(url, (err, db) => {
            if (err){
                db.close()
                return res.status(501).send("err in MongoClient.connect is: ", err);
            }
            const dbo = db.db("formcreator");
            dbo.createCollection(`${name}`, function (err, res) {
                if (err)
                    return res.status(502).send("err in dbo.createCollection is: ", err);
                console.log("Collection created!");
                db.close();
            });
        })

        //saving the configutarion to Configurations collection
        const didSave = await config.save()
        if (didSave) {
            const myObj = {
                msg: "new configuration for form created successfully",
                link: link
            }
            res.status(200).json(myObj)
        }
        else{
            const myObj = {
                msg: "problem with saving the configuration"
            }
            return res.status(503).send("problem with saving the configuration")
        }

    } catch (error) {
        if (error) {
            console.log("error in createForm is: ", error)
            res.status(504).send("error in createForm is: ", error)
        }
    }

}


const getForm = (req, res, next) => {

    
    const title = req.query.title//title(/name) of the research
    try {
        //check if the wanted form even exists
        Config.findOne({ name: title.replace(/-/g, " ") }, (err, data) => {
            if (err) {
                console.log("error in getForms is: ", err)
                return res.status(500).send("error in getForm in readdir is: ", err)
            }

            console.log(title.replace(/-/g, " "))
            console.log("data is: ",data)

            let myObj = {
                schema: data.schema,
                UI: data.ui,
                nameOfCollection: title.replace(/-/g, " ")
            }
            //returning the form's data and configuration
            return res.status(200).send(myObj)



        })
    } catch (error) {
        if (error) {
            console.log("error in getForms is: ", err)
            res.status(500).send("error in getForms is: ", err)
        }
    }
}


const saveAnswers = (req, res) => {

    const nameOfCollection = req.body.name //name of collection (same as research name) with which we want to work
    console.log("this is the collection: ", nameOfCollection)

    const date = new Date()
    const dateStr = `${date.getDate()}-${(date.getMonth())+1}-${date.getFullYear()},${date.getHours()}:${date.getMinutes()}`
    const myobj = {
        answers: req.body.answers,
        date: dateStr
    };

    MongoClient.connect(url, function (err, db) {
        
        if (err) {
            console.log("error in MongoClient.connect in saveAnswers is: ", err)
            db.close()
            return res.status(500).send("error in MongoClient.connect in saveAnswers is: ", err)
        }
        const dbo = db.db("formcreator");
        //saving answers to desired collection
        dbo.collection(`${nameOfCollection}`).insertOne(myobj, function (err, response) {
            if (err) {
                console.log("error in dbo.collection or in insertOne in saveAnswers is: ", err)
                db.close()
                return res.status(501).send("error in dbo.collection or in insertOne in saveAnswers is: ", err)
            }
            console.log("document saved");
            db.close();
        });
    });
    
        
    
        return res.status(200).send("answers saved successfully")

}

const getAnswers = (req, res) => {
    const nameOfCollection = req.query.name //name of collection (same as research name) with which we want to work
    try {

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("error in MongoClient.connect in getAnswers is: ", err)
                db.close()
                return res.status(500).send("error in MongoClient.connect in getAnswers is: ", err)
            }
            const dbo = db.db("formcreator"); //connecting to database in the nme of formcreator- our database

            //retrieving results from the desired collection
            dbo.collection(`${nameOfCollection}`).find({}).toArray(function (err, result) {
                if (err) {
                    console.log("err in dbo.collectio.find in getAnswers is: ", err)
                    return res.status(502).send("err in dbo.collectio.find in getAnswers is: ", err)
                }
                console.log(result);
                db.close();

                return res.status(200).send(result)
            });
        });
    } catch (error) {
        if (error) {
            console.log("error in getAnswers is: ", error)
            return res.status(501).send("error in getAnswers is: ", error)
        }
    }
}

module.exports = { createForm, getForm, saveAnswers, getAnswers }


