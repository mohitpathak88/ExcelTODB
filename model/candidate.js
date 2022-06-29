const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var candidateSchema = new Schema({
    name:String,
    class:Number,
    subject:String
});

var Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;