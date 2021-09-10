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

        res.status(200).end(JSON.stringify(UI_schema_JSON))
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
            console.error("problem in create UI schema:\n " + error)
    }
}

//creates the regular (not UI) schema
const createSchema = (file,data) => {
    try {
        file.set("type","object")
        file.set("properties",{})
        for(const key in data)
        {
            if(key!="form_title")
            {
                const inner_section=data[key]
                const temp_inner_JSON=checkForFields(inner_section)
                //add to bigger JSON and what not
            }
        }
        file.save()
        return
    } catch (error) {
        if (error)
            console.error("problem in create schema:\n " + error)
    }
}


const checkForFields=(inner_section)=>{
    try {
        for(const field in inner_section)
        {
            if(inner_section[field]=="string")//checks if the current inner section represents a string type attribute
            {
                console.log("it's a string")
                const inner_string_JSON=checkStringFields(inner_section)
            }
            else if(inner_section[field]=="Number"||inner_section[field]=="Integer")//checks if the current inner section represents a number type attribute
            {
                console.log("it's a num")
                const inner_num_JSON=checkNumFields()
            }
            else{//if not number or string-should be boolean
                //fill boolean logic
            }
        }
    } catch (error) {
        if(error)
            console.error("error in checkForFields:\n"+error)
    }
}

//takes the inner_section fields and returns a json
const checkStringFields=(inner_section)=>{
    try {
        const fieldsArr=[]
        
        if("minLength" in inner_section)
        {
            fieldsArr.push('"minLength":'+inner_section.minLength)
        }
        if("maxLength" in inner_section)
        {
            fieldsArr.push('"maxLength":'+inner_section.maxLength)
        }
        if("description" in inner_section)
        {
            fieldsArr.push('"description":'+inner_section.description)
        }
        if("date" in inner_section)
        {
            fieldsArr.push('"date":'+inner_section.date)
        }
        if("values" in inner_section)
        {
            fieldsArr.push('"values":'+inner_section.values)
        }
        fieldsArr.push("}")
        
        let my_JSON="{"

        for(let i=0;i<fieldsArr.length-1;i++)
        {
            if(fieldsArr[i]!=null)
            {
                my_JSON+=fieldsArr[i]
            }
            if(fieldsArr[i+1]!=null&&i!=fieldsArr.length-2)
            {
                my_JSON+=","
            }
        }
        my_JSON+="}"
        console.log("nigga:\n"+my_JSON)
        my_JSON=JSON.parse(my_JSON)
        
        
    } catch (error) {
        if(error)
        console.error("problem with checkStringFields:\n"+error)
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