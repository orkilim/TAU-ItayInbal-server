const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());

//connection to MongoDB 
require('./db')

//middlewares 
app.use('/', express.static('./public'));

//CORS handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
const router = require("./routes");

//adding a router as a middleware
app.use("/", router);

const controller=require('./controller')

app.get('/get-results', controller.getAnswers);

app.use(bodyParser.json());

module.exports={app}