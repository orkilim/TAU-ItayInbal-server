const mongoose = require('mongoose');
//const Guard = require('./guard')
//mongoose.set('useFindAndModify', false);

const schema = {
    name: { type: String, required: true },
    schema: {type:Object, required: true},
    ui: {type:Object},
    link: { type: String,required:true },
}


const config_schema = new mongoose.Schema(schema);
const Config = mongoose.model('configuration', config_schema);
module.exports = Config;