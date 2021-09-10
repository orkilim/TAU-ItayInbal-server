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
        let UI_file = editJsonFile(`${__dirname}/${data.form_title} UIschema.json`);
        let file = editJsonFile(`${__dirname}/${data.form_title} schema.json`);

        const UI_schema_JSON = createUIschema(UI_file, data)//creates the UIschema
        const schema_JSON = createSchema(file, data)//creates the schema

        file.save()

        res.status(200).end("Form created successfully")
    } catch (err) {
        res.status(404).send("a problem has occured with addForm action");
    }
}

//creates the UIschema
const createUIschema = (UI_file, data) => {
    try {
        UI_file.set("type", "group")
        UI_file.set("label", data.form_title)
        UI_file.set("elements", [])
        //going through the JSON received in the request (data) and setting the fields
        for (const key in data) {
            if (key != "form_title") {
                const inner_section = data[key]
                const tempJSON = {
                    "type": "control",
                    "label": inner_section.field_name
                }
                UI_file.append("elements", tempJSON)
            }
        }

        UI_file.save()
        return
    } catch (error) {
        if (error)
            console.log("problem in create UI schema:\n " + error)
    }
}

//creates the regular (not UI) schema
const createSchema = (file,data) => {
    try {
        
    } catch (error) {
        if (error)
            console.log("problem in create UI schema:\n " + error)
    }
}

//A method to build the JSON that will create the forms with JSONforms
const buildInnerSections = (inner_key, inner_section, file) => {
    switch (inner_key) {
        case "field_name":
            {
                file.set(inner_key, {})
                break;
            }
        case "field_type":
            {



                break
            }
        case "values":
            {
                //should enter values
                break
            }

    }
}


module.exports = { addForm, getForm }



/**
 * //making the new JSON with that title
        file.set("form_title", data.form_title)

        //going through the json to figure out the data types
        for (let key in data) {
            if (key != "form_title") {
                const inner_section = data[key]
                for (const inner_key in inner_section) {
                    buildInnerSections(inner_key, inner_section, file)
                }
            }
        }
 */