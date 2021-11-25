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
    const ui = req.body.ui
    const name = req.body.name
    if(name==null||schema==null)
    {
        console.log("name or schema are null")
        return res.status(500).send("name or schema are null")
    }
    const nameForLink = name.replace(/ /g, "-")
    console.log("this will go to link: ", nameForLink)
    try {

        const link = `http://localhost:3000/forms/${nameForLink}`

        const config = new Config({ name, schema,ui, link })//ui attribute taken off the Config creation object
        const result = await Config.findOne({ name: name })
        if (result) {
            return res.status(201).send("a form with that name already exists")
        }

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

    const path = "C:/Users/Or/Desktop/TAU- work/Itay and Inbal's project/JSONs"
    const title = req.query.title
    //let JSONsArr = []
    try {

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
    const nameOfCollection = req.body.name
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
    const nameOfCollection = req.query.name
    try {

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("error in MongoClient.connect in getAnswers is: ", err)
                db.close()
                return res.status(500).send("error in MongoClient.connect in getAnswers is: ", err)
            }
            var dbo = db.db("formcreator");

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


