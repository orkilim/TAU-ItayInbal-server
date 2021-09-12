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

        const two_JSONs={
            "schema":schema_JSON,
            "UI":UI_schema_JSON
        }

        res.status(200).end(JSON.stringify(two_JSONs))
    } catch (err) {
        res.status(404).send("a problem has occured with addForm action:\n"+err);
    }
}

//creates the UIschema
const createUIschema = (UI_file, data) => {
    try {
        UI_file.set("type", "VerticalLayout")
        UI_file.set("label", data.form_title)
        UI_file.set("elements", [])
        //going through the JSON received in the request (data) and setting the fields
        for (const key in data) {
            if (key != "form_title") {
                const inner_section = data[key]
                const tempJSON = {
                    "type": "control",
                    "scope":"#/properties/"+inner_section.field_name,
                    "label": inner_section.field_name
                }
                UI_file.append("elements", tempJSON)
            }
        }

        UI_file.save()
        return UI_file.get()
    } catch (error) {
        if (error)
            console.error("problem in create UI schema:\n " + error)
    }
}

//creates the regular (not UI) schema
const createSchema = (file, data) => {
    try {
        file.set("type", "object")
        file.set("properties", {})
        for (const key in data) {
            if (key != "form_title") {
                const inner_section = data[key]
                const temp_inner_JSON = checkForFields(inner_section)
                const temp_key = "properties." + inner_section.field_name
                file.set(temp_key, temp_inner_JSON)
            }
        }
        file.save()
        return file.get()
    } catch (error) {
        if (error)
            console.error("problem in createSchema:\n " + error)
    }
}

//#region Field separtion logic
const checkForFields = (inner_section) => {
    try {
        for (const field in inner_section) {
            if (inner_section["field_type"] == "string")//checks if the current inner section represents a string type attribute
            {
                console.log("it's a string")
                const inner_string_JSON = checkStringFields(inner_section)
                return inner_string_JSON
            }
            else if (inner_section["field_type"] == "number" || inner_section[field] == "integer")//checks if the current inner section represents a number type attribute
            {
                console.log("it's a num")
                const inner_num_JSON = checkNumFields(inner_section)
                return inner_num_JSON
            }
            else {//if not number or string-should be boolean
                console.log("it's boolean")
                const name = inner_section.field_name
                const inner_bool_JSON = {
                    "type": "boolean"
                }
                return inner_bool_JSON
            }
        }
    } catch (error) {
        if (error)
            console.error("error in checkForFields:\n" + error)
    }
}

//takes the inner_section fields and returns a json in case of string attribute
const checkStringFields = (inner_section) => {
    try {
        const fieldsArr = []

        if ("minLength" in inner_section) {
            fieldsArr.push('"minLength":' + inner_section.minLength)
        }
        if ("maxLength" in inner_section) {
            fieldsArr.push('"maxLength":' + inner_section.maxLength)
        }
        if ("description" in inner_section) {
            fieldsArr.push('"description":' + inner_section.description)
        }
        if ("date" in inner_section) {
            fieldsArr.push('"date":' + inner_section.date)
        }
        if ("values" in inner_section) {
            fieldsArr.push('"values":' + inner_section.values)
        }
        fieldsArr.push("}")

        let my_JSON = '{"type":"string",'//the string that will later become the JSON we send back

        for (let i = 0; i < fieldsArr.length - 1; i++) {
            if (fieldsArr[i] != null) {
                my_JSON += fieldsArr[i]
            }
            if (fieldsArr[i + 1] != null && i != fieldsArr.length - 2) {
                my_JSON += ","
            }
        }
        my_JSON += "}"
        my_JSON = JSON.parse(my_JSON)
        return my_JSON
    } catch (error) {
        if (error)
            console.error("problem with checkStringFields:\n" + error)
    }
}
//checks the field in case of a number or integer attribute and returns a json
const checkNumFields = (inner_section) => {
    try {
        const fieldsArr = []

        if ("description" in inner_section) {
            fieldsArr.push('"description":' + inner_section.description)
        }
        if ("maximum" in inner_section) {
            fieldsArr.push('"maximum":' + inner_section.maximum)
        }
        if ("minimum" in inner_section) {
            fieldsArr.push('"minimum":' + inner_section.minimum)
        }
        if ("default" in inner_section) {
            fieldsArr.push('"default":' + inner_section.default)
        }

        fieldsArr.push("}")

        let my_JSON = '{"type":"number",'//the string that will later become the JSON we send back

        for (let i = 0; i < fieldsArr.length - 1; i++) {
            if (fieldsArr[i] != null) {
                my_JSON += fieldsArr[i]
            }
            if (fieldsArr[i + 1] != null && i != fieldsArr.length - 2) {
                my_JSON += ","
            }
        }
        my_JSON += "}"
        my_JSON = JSON.parse(my_JSON)
        return my_JSON
    } catch (error) {
        if (error)
            console.error("error in checkNumFields: " + error)
    }
}

//#endregion


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

//A method to build the JSON that will create the forms with JSONforms
/**
 * const buildInnerSections = (inner_key, inner_section, file) => {
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

 */