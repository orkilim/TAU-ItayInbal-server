//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const editJsonFile = require("edit-json-file");

//let file = editJsonFile(`${__dirname}/test.json`);

const getForm = (req, res, next) => {
    try {
        const form_title = req.query.title
        let file = editJsonFile(`${__dirname}/${form_title}.json`);
        const json_returned = JSON.stringify(file.get())
        res.status(200).end(json_returned)
    } catch (err) {
        res.status(404).send("a problem has occured with getForm");
    }
}

const addForm = (req, res, next) => {
    try {
        const data = req.body
        //creating a JSON with the name requested
        let file = editJsonFile(`${__dirname}/${data.form_title}.json`);

        //making the new JSON with that title
        file.set("form_title", data.form_title)

        //going through the json to figure out the data types 
        for (let key in data) {
            if (key != "form_title") {
                const inner_section = data[key]
                for (const inner_key in inner_section) {
                    buildInnerSections(inner_key,inner_section,file)
                }
            }
        }

        file.save()

        res.status(200).end("Form created successfully")
    } catch (err) {
        res.status(404).send("a problem has occured with addForm action");
    }
}


const buildInnerSections=(inner_key,inner_section,file)=>{
    switch (inner_key) {
        case "field_name":
            {
                file.set(key + "." + inner_key, inner_section[inner_key])
                break;
            }
        case "field_type":
            {
                //put JSONforms eligable stuff here!!!!!
                break
            }
        
    }
}

module.exports = { addForm, getForm }