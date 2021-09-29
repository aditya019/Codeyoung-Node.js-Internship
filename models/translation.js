const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationSchema = new Schema({
    fromLang: String,
    toLang : String,
    orignal : String,
    transText : String
});

module.exports = mongoose.model('Translation', translationSchema);