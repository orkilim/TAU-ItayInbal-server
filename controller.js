const Woman = require('../models/woman')
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
const date = require('date-and-time');


const addForm = (req, res, next) => {
    try {
        console.log("hello")
        res.status(200).send("working, yes you know how to make a server")
    } catch (err) {
        res.status(404).send('not found or already exist');
    }
}


module.exports={addForm}