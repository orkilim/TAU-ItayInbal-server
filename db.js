const mongoose = require('mongoose');
require('dotenv').config();
const {url}=require('./consts')

//options to configurate the connection to MongoDB va mongoose npm
const options = {
    //useCreateIndex: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(url, options);
const connection = mongoose.connection;
connection.on('error', err => console.error('connection error: ', err)); //error handling
connection.once('open', () => console.log('connected to: ', connection.name)) //connection handling