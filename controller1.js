//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
//const editJsonFile = require("edit-json-file");
const fs = require('fs');
const Config=require('./models/configuration')
const mongoose = require('mongoose');
//let file = editJsonFile(`${__dirname}/test.json`);
const MongoClient = require('mongodb').MongoClient;


const createForm = async (req, res, next) => {
    
    const schema=req.body.schema
    const ui=req.body.ui
    const name=req.body.name
    const nameForLink=name.replace(/ /g,"_")
    console.log("this will go to link: ",nameForLink)
    try {

        const link=`http://localhost:3000/form/${nameForLink}`

        const config=new Config({name,schema,ui,link})
        const result=await Config.findOne({name:name})
        if(result)
        {
            res.status(501).send("a form with that name already exists")
        }
        const didSave=await config.save()
        if(didSave)
        {
            const myObj={
                msg:"new configuration for form created successfully",
                link:link
            }
            res.status(200).send(JSON.stringify(myObj))
        }

    } catch (error) {
        if(error){
            console.log("error in createForm is: ",error)
            res.status(500).send("error in createForm is: ",error)
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
        else {
            res.status(200).send("answers saved successfully")
        }
    })

}

const getForm = (req, res, next) => {

    const path="C:/Users/Or/Desktop/TAU- work/Itay and Inbal's project/JSONs"
    const title=req.query.title
    let JSONsArr=[]
    try {
        fs.readdir(path, (err,files) => {
            if (err) {
                console.log("error in getForms is: ", err)
                res.status(500).send("error in getForm in readdir is: ", err)
            }
            //console.log("files: "+files)
            for(let i=0;i<files.length;i++)
            {
                const tempArr=files[i].split(" ")
                if(tempArr[0]==title)
                {
                    JSONsArr.push(files[i])
                }
            }
            //console.log("JSONsArr is:",JSONsArr)

            let myObj={
                schema:"",
                UI:""
            }
            //const path="C:/Users/Or/Desktop/TAU- work/Itay and Inbal's project/JSONs"
            fs.readFile(path+"/"+JSONsArr[0],(err,data)=>{
                if(err)
                {
                    res.status(501).send("problem with readfile for schema in getForm is: ",err)
                }
                myObj.schema=JSON.parse(data)

                fs.readFile(path+"/"+JSONsArr[1],(err,data)=>{
                    if(err)
                    {
                        res.status(502).send("problem with readfile for UI in getForm is: ",err)
                    }
                    myObj.UI=JSON.parse(data)
                    res.status(200).send(myObj)
                })
                

            })
        })
    } catch (error) {
        if (error) {
            console.log("error in getForms is: ", err)
            res.status(500).send("error in getForms is: ", err)
        }
    }
}

const getJSONS=(req,res)=>{
    const title=req.query.title
    const path="C:/Users/Or/Desktop/TAU- work/Itay and Inbal's project/JSONs"
    try {
        fs.readdir(path, (err,files) => {
            if (err) {
                console.log("error in getJSONS is: ", err)
                res.status(500).send("error in getJSONS in readdir is: ", err)
            }
            console.log("files: "+files)
            let myObj={
                schema:"",
                UI:""
            }
            let i=0
            for(;i<files.length;i++)
            {
                if(title==files[i])
                {
                    break;
                }
            }
            console.log("title is: "+title)
            console.log("path for readfile is: "+path+"/"+files[i])
            fs.readFile(path+"/"+files[i],(err,data)=>{
                if(err)
                {
                    res.status(500).send("problem with readfile for schema in getJSONS is: ",err)
                }
                myObj.schema=JSON.parse(data)

                fs.readFile(path+"/"+files[i+1],(err,data)=>{
                    if(err)
                    {
                        res.status(500).send("problem with readfile for UI in getJSONS is: ",err)
                    }
                    myObj.UI=JSON.parse(data)
                    res.status(200).send(myObj)
                })
                
                


            })
            
        })
    } catch (error) {
        if(error){
            res.status(500).send("problem with getJSONS is: ",error)
        }
    }
}


module.exports = { createForm, handleData,getForm,getJSONS }


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