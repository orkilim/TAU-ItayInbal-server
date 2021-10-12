//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const editJsonFile = require("edit-json-file");
const fs = require('fs')

//let file = editJsonFile(`${__dirname}/test.json`);

const getForms = (req, res, next) => {
    const amount = req.query.amountOfResearchers//the amount of names of researchers in the query
    if (amount == 0) {
        findFormsByName(null, 0)

    }
    let namesArr = []
    try {
        for (let i = 1; i <= amount; i++) {
            const nameStr = "name" + i
            namesArr.push(req.query[nameStr])
        }
        console.log("namesArr is: " + namesArr)
        namesArr = namesArr.sort()
        findFormsByName(namesArr, amount).then((data) => {
            console.log("blah blah")
            console.log("myForms is: ", data)
            switch (data) {
                case 0:
                    {
                        res.status(200).send(0)//there are no files with these names
                        break;
                    }
                case 1:
                    {
                        res.status(200).send(-1)//UIschema or Schema files are missing in atleast one of the forms
                        break;
                    }
            }

            res.status(200).send(data.myForms)

        })
            .catch((error) => {
                if (error)
                    res.send("problem with promise in getForms: " + error)
            })
    } catch (error) {
        if (error)
            res.status(200).end("problem with getForms: " + error)
    }
}

const findFormsByName = (namesArr, amountOFnames) => {
    //GENERAL SEARCH FOR ALL FORMS
    if (namesArr == null && amountOFnames == 0)//retrieve ALL projects
    {
        console.log("i am in 1")
        return new Promise((resolve, reject) => {
            let myForms = []
            let missingSchemaFileArr = []
            let missingUIschemaFileArr = []
            try {
                fs.readdir(`${__dirname}`, (err, myFiles) => {
                    if (err) {
                        console.log("problem with readdir in getForms in findFormsByNames: " + err)
                        return -3//problem with readdir
                    }
                    let stop = false; let startIndex = 0; let endIndex = 0;
                    while (!stop)//a loop to detemine where the form files start and where they end
                    {
                        if (!(myFiles[startIndex].includes("formfile"))) {
                            startIndex++
                            endIndex++
                        }
                        else if (myFiles[endIndex].includes("formfile")) {
                            endIndex++
                        }
                        else {
                            stop = true
                        }


                    }
                    endIndex--
                    console.log(startIndex, endIndex)
                    for (let i = startIndex; i <= endIndex; i += 2)//a loop to run through all the files we got
                    {
                        let tempArrSchema = myFiles[i].split(" ")//the file name splited to separated words
                        let tempArrUI = myFiles[i + 1].split(" ")
                        if ((tempArrSchema[tempArrSchema.length - 2] == tempArrUI[tempArrUI.length - 2]) && (tempArrSchema[tempArrSchema.length - 1] == "Schema.json") && (tempArrUI[tempArrUI.length - 1] == "UIschema.json")) {

                            //working on one array because they are completely similar besides the UIschema.json/Schema.json

                            tempArrSchema.splice(tempArrSchema.length - 1, 1)//to remove the words UIschema.json or Schema.json
                            tempArrSchema.splice(tempArrSchema.length - 1, 1)//to remove project's name


                            myForms.push(myFiles[i], myFiles[i + 1])
                        }

                        //TO ENABLE THE COMMENTS AFTER THIS LINE BECAUSE THEY CHECK IF THERE IS A FILE MISSING FOR A PROJECT!!!!!

                        //#region Check if a file is missing

                        /*else if(tempArrSchema[tempArrSchema.length - 2] != tempArrUI[tempArrUI.length - 2]){
                            missingSchemaFileArr.push(myFiles[i])
                            missingUIschemaFileArr.push(myFiles[i+1])
                        }
                        else if(tempArrSchema[tempArrSchema.length - 1] != "Schema.json"){//if one of the conditions didn't happen
                            missingSchemaFileArr.push(myFiles[i]) //need to create a new Schema.json for that specific project name
                        }
                        else if(tempArrUI[tempArrUI.length - 1] == "UIschema.json")
                        {
                            missingUIschemaFileArr.push(myFiles[i+1]) //need to create a new UIschema for that specific project name
                        }*/
                        //#endregion

                    }

                    //console.log("myForms: ",myForms)


                })


                if (myForms.length == 0) {
                    console.log("empty")
                    resolve(0)//in case non with these names were found
                }
                else if (myForms.length % 2 == 1) {
                    console.log("uneven amount of files means something is probably missing")
                    resolve(-1)//in case there is a missing file of UIschema or Schema in one of the forms
                }
                else {//need to check if there is a UIschema and Schema JSONs for each form
                    console.log("everything's cool")
                    const myObj = {//everything's good
                        myForms: myForms,
                        missingUI: missingUIschemaFileArr,
                        missingSchema: missingSchemaFileArr
                    }
                    resolve(myObj)
                }

            } catch (err) {
                res.status(404).send("a problem has occured with findFormsByName: " + err);
            }
        })
    }

    //************************************************************ */
    //SEARCH BY NAME!!!!!
    return new Promise((resolve, reject) => {
        console.log("i am in 2")
        let myForms = []
        let missingSchemaFileArr = []
        let missingUIschemaFileArr = []
        try {
            fs.readdir(`${__dirname}`, (err, myFiles) => {
                if (err) {
                    console.log("problem with readdir in getAllForms in findFormsByNames: " + err)
                    return -3//problem with readdir
                }
                let stop = false; let startIndex = 0; let endIndex = 0;
                while (!stop)//a loop to detemine where the form files start and where they end
                {
                    if (!(myFiles[startIndex].includes("formfile"))) {
                        startIndex++
                        endIndex++
                    }
                    else if (myFiles[endIndex].includes("formfile")) {
                        endIndex++
                    }
                    else {
                        stop = true
                    }


                }
                endIndex--
                console.log(startIndex, endIndex)
                for (let i = startIndex; i <= endIndex; i += 2)//a loop to run through all the files we got
                {
                    let tempArrSchema = myFiles[i].split(" ")//the file name splited to separated words
                    let tempArrUI = myFiles[i + 1].split(" ")
                    if ((tempArrSchema[tempArrSchema.length - 2] == tempArrUI[tempArrUI.length - 2]) && (tempArrSchema[tempArrSchema.length - 1] == "Schema.json") && (tempArrUI[tempArrUI.length - 1] == "UIschema.json")) {

                        //working on one array because they are completely similar besides the UIschema.json/Schema.json

                        tempArrSchema.splice(tempArrSchema.length - 1, 1)//to remove the words UIschema.json or Schema.json
                        tempArrSchema.splice(tempArrSchema.length - 1, 1)//to remove project's name

                        tempArrSchema = tempArrSchema.sort()//an alphabetically sorted string array. at this point the tempArr contains only the names of the researchers
                        let j = 0;
                        let flag = true//flag to show if all the names are in current tempArr file name
                        console.log("tempArr inside is: " + tempArrSchema)
                        for (; j < amountOFnames && flag == true; j++) {

                            if (!(tempArrSchema.includes(namesArr[j]))) {
                                flag = false
                            }
                        }
                        if (flag)
                            myForms.push(myFiles[i], myFiles[i + 1])
                    }

                    //TO ENABLE THE COMMENTS AFTER THIS LINE BECAUSE THEY CHECK IF THERE IS A FILE MISSING FOR A PROJECT!!!!!

                    //#region Check if a file is missing

                    /*else if(tempArrSchema[tempArrSchema.length - 2] != tempArrUI[tempArrUI.length - 2]){
                        missingSchemaFileArr.push(myFiles[i])
                        missingUIschemaFileArr.push(myFiles[i+1])
                    }
                    else if(tempArrSchema[tempArrSchema.length - 1] != "Schema.json"){//if one of the conditions didn't happen
                        missingSchemaFileArr.push(myFiles[i]) //need to create a new Schema.json for that specific project name
                    }
                    else if(tempArrUI[tempArrUI.length - 1] == "UIschema.json")
                    {
                        missingUIschemaFileArr.push(myFiles[i+1]) //need to create a new UIschema for that specific project name
                    }*/
                    //#endregion

                }

                //console.log("myForms: ",myForms)

                if (myForms.length == 0) {
                    console.log("empty")
                    resolve(0)//in case non with these names were found
                }
                else if (myForms.length % 2 == 1) {
                    console.log("uneven amount of files means something is probably missing")
                    resolve(-1)//in case there is a missing file of UIschema or Schema in one of the forms
                }
                else {//need to check if there is a UIschema and Schema JSONs for each form
                    console.log("everything's cool")
                    const myObj = {//everything's good
                        myForms: myForms,
                        missingUI: missingUIschemaFileArr,
                        missingSchema: missingSchemaFileArr
                    }
                    resolve(myObj)
                }
            })
        } catch (err) {
            res.status(404).send("a problem has occured with findFormsByName: " + err);
        }
    })
}


const addForm = (req, res, next) => {
    try {
        const data = req.body
        console.log("this is the body received: " + JSON.stringify(data))
        //creating a JSON with the name requested
        let UI_file = editJsonFile(`${__dirname}/formfile ${data.form_title} UIschema.json`);
        let file = editJsonFile(`${__dirname}/formfile ${data.form_title} schema.json`);

        const UI_schema_JSON = createUIschema(UI_file, data)//creates the UIschema
        const schema_JSON = createSchema(file, data)//creates the schema

        const two_JSONs = {
            "schema": schema_JSON,
            "UI": UI_schema_JSON
        }
        console.log(two_JSONs)
        res.status(200).end(JSON.stringify(two_JSONs))
    } catch (err) {
        res.status(404).send("a problem has occured with addForm action:\n" + err);
    }
}
//#region Add form

//creates the UIschema
const createUIschema = (UI_file, data) => {
    try {
        UI_file.set("type", "Group")
        let project_title = "Form by "
        const contactArr = data.contactInfo
        for (let i = 0; i < contactArr.length; i++)//loop to create the project's title with the name of the researchers
        {
            project_title += contactArr[i].name
            if (contactArr.length > 1) {
                if (i < contactArr.length - 2) {
                    project_title += ", "
                }
                if (i == contactArr.length - 2) {
                    project_title += " and "
                }
            }
        }
        UI_file.set("label", project_title)
        UI_file.set("elements", [])
        //going through the object received in the request (data) and setting the fields
        const data_fields_values = data.dataFieldsValues
        for (let i = 0; i < data_fields_values.length; i++) {
            const inner_section = data_fields_values[i]
            const tempJSON = {
                "type": "Control",
                "scope": "#/properties/" + inner_section.field_name,
                //"label": inner_section.field_name
            }
            UI_file.append("elements", tempJSON)
        }
        //UI_file.save()
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
        const data_fields_values = data.dataFieldsValues
        for (let i = 0; i < data_fields_values.length; i++) {
            const inner_section = data_fields_values[i]
            const temp_inner_JSON = checkForFields(inner_section)
            const temp_key = "properties." + inner_section.field_name
            file.set(temp_key, temp_inner_JSON)
        }
        //file.save()
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
            if (inner_section.field_type == "text")//checks if the current inner section represents a string type attribute
            {
                const inner_string_JSON = checkStringFields(inner_section)
                return inner_string_JSON
            }
            else if (inner_section.field_type == "number")//checks if the current inner section represents a number type attribute
            {
                const inner_num_JSON = checkNumFields(inner_section)
                return inner_num_JSON
            }
            else {//if not number or string-should be boolean
                //const name = inner_section.field_name
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
        if (inner_section.text_type == "Free-Text") {
            fieldsArr.push('"description":"' + inner_section.field_name + '"')
            if (inner_section.min_val != "") {
                fieldsArr.push(',"minLength":' + inner_section.min_val)
            }
            if (inner_section.max_val != "") {
                fieldsArr.push(',"maxLength":' + inner_section.max_val)
            }
        }
        if (inner_section.text_type == "Date") {
            fieldsArr.push('"format":"date"')
        }
        if (inner_section.text_type == "Choice Menu (Dropdown)") {
            let values_for_dropdown_menu_array = []
            for (let i = 0; i < inner_section.dropdown_fields_values.length; i++) {
                values_for_dropdown_menu_array.push('"' + (inner_section.dropdown_fields_values[i]).value_name + '"')
            }
            fieldsArr.push('"enum":[' + values_for_dropdown_menu_array + "]")
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
        //console.log("this is my json string: "+my_JSON)
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

        /*if ("description" in inner_section) {
            fieldsArr.push('"description":' + inner_section.description)
        }*/
        if (inner_section.max_val != "") {
            fieldsArr.push('"maximum":' + inner_section.max_val)
        }
        if (inner_section.min_val != "") {
            fieldsArr.push('"minimum":' + inner_section.min_val)
        }
        /*if ("default" in inner_section) {
            fieldsArr.push('"default":' + inner_section.default)
        }*/

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

//#endregion
module.exports = { addForm, getForms }



