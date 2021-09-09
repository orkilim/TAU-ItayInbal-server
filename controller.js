//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const editJsonFile = require("edit-json-file");

//let file = editJsonFile(`${__dirname}/test.json`);

const getForm = (req, res, next) => {
    try {
        const formTitle=req.query.title
        let file = editJsonFile(`${__dirname}/${formTitle}.json`);
        console.log(file.get())
        res.status(200).send("form Received")
    } catch (err) {
        res.status(404).send("a problem has occured with getForm");
    }
}

const addForm = (req, res, next) => {
    try {
        let file = editJsonFile(`${__dirname}/${req.body.formTitle}.json`);
        file.set("works?",true)
        console.log(file.get())
        file.save()
        res.status(200).send("working, yes you know how to make a server")
    } catch (err) {
        res.status(404).send("a problem has occured with addForm action");
    }
}


module.exports={addForm,getForm}