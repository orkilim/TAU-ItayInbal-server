const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());

//connection to MongoDB 
require('./db')

//#region Middlewares


//CORS handling
/**
 * CORS is the protocol that makes sure that the server doesn't get any calls from suspicious domains
 * we use the following middleware(=settings) to enable calls to this server from a different domain
 */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//allowing the server to use JSONs and url-encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//#endregion

//adding a router as a middleware-will help us route the requests instead of specifying them here
const router = require("./routes");

app.use("/", router);


app.use(bodyParser.json());


//exporting the server (named "app") so we can test in later on
module.exports={app}