//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const editJsonFile = require("edit-json-file");
const fs = require('fs')

//let file = editJsonFile(`${__dirname}/test.json`);

const createForm = (req, res, next) => {
    const filePath=req.body.path
    const html=req.body.html
    console.log(filePath)
    if(filePath==null)
    {
        console.log("no such file")
        //res.status(200).send(-1)
    }
    try {
        fs.writeFile(`${filePath}`,html,(err)=>{
            if(err)
            {
                console.log("problem of fs.writeFile is: ",err)
            }
        })
        res.status(200).send("everything's good")
    } catch (error) {
        if(error){
            console.log("error in controller1 in getForms is: "+error)
            res.send(500).send("error in controller1 getForms is: ",error)
        }
    }
}


module.exports = { createForm }



