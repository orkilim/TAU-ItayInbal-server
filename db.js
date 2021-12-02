const mongoose = require('mongoose');
require('dotenv').config();
const url=process.env.DB_URL
//options to configurate the connection to MongoDB va mongoose npm
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(url, options); //connecting to our formcreator database
const connection = mongoose.connection; //creating a connection object
connection.on('error', err => console.error('connection error: ', err)); //error handling
connection.once('open', () => console.log('connected to: ', connection.name)) //connection handling


