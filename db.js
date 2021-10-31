const mongoose = require('mongoose');
require('dotenv').config();
const DB_URL=process.env.DB_URL

const options = {
    //useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(DB_URL, options);
const connection = mongoose.connection;
connection.on('error', err => console.error('connection error: ', err));
connection.once('open', () => console.log('connected to: ', connection.name))