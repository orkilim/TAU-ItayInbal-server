const mongoose = require('mongoose');

//creating the schema that will determine what goes to each Configuration object in the Configuration colection
const schema = {
    name: { type: String, required: true },
    schema: {type:Object, required: true},
    ui: {type:Object},
    link: { type: String,required:true },
}


const config_schema = new mongoose.Schema(schema);
const Config = mongoose.model('configuration', config_schema);
module.exports = Config;