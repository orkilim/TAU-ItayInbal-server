//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const editJsonFile = require("edit-json-file");
const fs = require('fs')

//let file = editJsonFile(`${__dirname}/test.json`);

const createForm = (req, res, next) => {
    const filePath = req.body.formPath
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
        let tempStrA=""
        let tempStrB=""
        while (position !== -1) {
            //count++;
            if (count == 0) {
                tempStrA = newHtml.slice(0, position + 7)
                tempStrB = newHtml.slice(position + 7)
            }
            else{
                tempStrA = tempNewHtml.slice(0, position + 7)
                tempStrB = tempNewHtml.slice(position + 7)
            }
            console.log("\n\ntempStrA: ",tempStrA+"\ntempStrB: ",tempStrB)
            tempNewHtml = tempStrA.concat(` name="${attributes[count]}" `,tempStrB)
            console.log("position is: ",position)
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
    }
}

const handleData = (req, res) => {
    console.log(req.query.saveIn)
    console.log(typeof req.query.saveIn)
    console.log("this is the received data from handleData: ", req.body)
    fs.writeFile(`${req.query.saveIn}/answers1.json`, JSON.stringify(req.body), (err) => {
        if (err) {
            res.status(500).send("error in handleData in writeFile is: ", err)
        }
        else{
            res.status(200).send("answers saved successfully")
        }
    })
    
}


module.exports = { createForm, handleData }



