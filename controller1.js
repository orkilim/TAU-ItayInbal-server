//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
//const editJsonFile = require("edit-json-file");
const fs = require('fs');
const Config = require('./models/configuration')
const mongoose = require('mongoose');
//let file = editJsonFile(`${__dirname}/test.json`);
const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_URL

const createForm = async (req, res, next) => {

    const schema = req.body.schema
    //const ui = req.body.ui was removed for now
    const name = req.body.name
    const nameForLink = name.replace(/ /g, "_")
    console.log("this will go to link: ", nameForLink)
    try {

        const link = `http://localhost:3000/form/${nameForLink}`

        const config = new Config({ name, schema, link })//ui attribute taken off the Config creation object
        const result = await Config.findOne({ name: name })
        if (result) {
            return res.status(501).send("a form with that name already exists")
        }

        MongoClient.connect(url, (err, db) => {
            if (err)
                return res.status(500).send("err in MongoClient.connect is: ", err);
            const dbo = db.db("formcreator");
            dbo.createCollection(`${name}`, function (err, res) {
                if (err)
                    return res.status(501).send("err in dbo.createCollection is: ", err);
                console.log("Collection created!");
                db.close();
            });
        })
        

        const didSave = await config.save()
        if (didSave) {
            const myObj = {
                msg: "new configuration for form created successfully",
                link: link
            }
            res.status(200).json(myObj)
        }

    } catch (error) {
        if (error) {
            console.log("error in createForm is: ", error)
            res.status(500).send("error in createForm is: ", error)
        }
    }

}


const getForm = (req, res, next) => {

    const path = "C:/Users/Or/Desktop/TAU- work/Itay and Inbal's project/JSONs"
    const title = req.query.title
    let JSONsArr = []
    try {

        Config.findOne({ name: title.replace(/_/g, " ") }, (err, data) => {
            if (err) {
                console.log("error in getForms is: ", err)
                return res.status(500).send("error in getForm in readdir is: ", err)
            }


            console.log(data)

            let myObj = {
                schema: data.schema,
                //UI: "",
                nameOfCollection: title.replace(/_/g, " ")
            }

            return res.status(200).send(myObj)

            /*if (err) {
                return res.status(501).send("problem with readfile for schema in getForm is: ", err)
            }
            myObj.schema = JSON.parse(data)*/


        })
    } catch (error) {
        if (error) {
            console.log("error in getForms is: ", err)
            res.status(500).send("error in getForms is: ", err)
        }
    }
}


const saveAnswers = (req, res) => {
    const nameOfCollection = req.body.name
    console.log("this is the collection: ", nameOfCollection)

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("error in MongoClient.connect in saveAnswers is: ", err)
            return res.status(500).send("error in MongoClient.connect in saveAnswers is: ", err)
        }
        var dbo = db.db("formcreator");
        var myobj = { answers: req.body.answers };
        dbo.collection(`${nameOfCollection}`).insertOne(myobj, function (err, response) {
            if (err) {
                console.log("error in dbo.collection or in insertOne in saveAnswers is: ", err)
                return res.status(501).send("error in dbo.collection or in insertOne in saveAnswers is: ", err)
            }
            console.log("document saved");
            res.status(200).send("answers saved successfully")
            db.close();
        });
    });

}

const getAnswers = (req, res) => {
    const nameOfCollection = req.query.name
    try {

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("error in MongoClient.connect in getAnswers is: ", err)
                return res.status(500).send("error in MongoClient.connect in getAnswers is: ", err)
            }
            var dbo = db.db("formcreator");
            
            dbo.collection(`${nameOfCollection}`).find({}).toArray(function (err, result) {
                if (err){ 
                    console.log("err in dbo.collectio.find in getAnswers is: ",err)
                    return res.status(502).send("err in dbo.collectio.find in getAnswers is: ",err)
                }
                console.log(result);
                db.close();
                
                return res.status(200).send(result)
            });
        });
    } catch (error) {
        if (error) {
            console.log("error in getAnswers is: ", error)
            res.status(501).send("error in getAnswers is: ", error)
        }
    }
}

module.exports = { createForm, getForm, saveAnswers, getAnswers/*handleData,*/ /*getJSONS,*/ }


//OLD createForm


/*const filePath = req.body.formPath
    const answersPath = req.body.answersPath
    const html = req.body.html
    console.log(filePath)
    if (filePath == "") {
        console.log("no such file")
        //res.status(200).send(-1)
    }
    try {
        const str = ` method="post" action="http://localhost:3030/route/handleData?saveIn=${answersPath}" `

        const tempStr1 = html.slice(0, 5)
        const tempStr2 = html.slice(5)
        const newHtml = "<!DOCTYPE html><html><body>" + tempStr1 + str + tempStr2 + "</body></html>"
        //console.log("new html: ",newHtml,"\n\n")
        const attributes = req.body.myJSON
        //console.log(attributes)

        let count = 0;
        let position = newHtml.indexOf("<input");
        let tempNewHtml = ""
        let tempStrA = ""
        let tempStrB = ""
        while (position !== -1) {
            //count++;
            if (count == 0) {
                tempStrA = newHtml.slice(0, position + 7)
                tempStrB = newHtml.slice(position + 7)
            }
            else {
                tempStrA = tempNewHtml.slice(0, position + 7)
                tempStrB = tempNewHtml.slice(position + 7)
            }
            console.log("\n\ntempStrA: ", tempStrA + "\ntempStrB: ", tempStrB)
            tempNewHtml = tempStrA.concat(` name="${attributes[count]}" `, tempStrB)
            console.log("position is: ", position)
            //console.log("blah with ", attributes[count] + ":\n" + tempNewHtml)
            count++
            position = tempNewHtml.indexOf("<input", position + 1);
        }

        console.log("new html: ", tempNewHtml)
        fs.writeFile(`${filePath}/test1.html`, tempNewHtml, (err) => {
            if (err) {
                res.status(500).send("problem of fs.writeFile is: ", err)
            }
            else {
                res.status(200).send(`everything's good, form saved in ${filePath}`)
            }
        })

    } catch (error) {
        if (error) {
            console.log("error in controller1 in createForm is: " + error)
            res.send(500).send("error in controller1 in createForm is: ", error)
        }
    }*/