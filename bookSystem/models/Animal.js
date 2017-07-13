var mongoose = require('mongoose');
var db = require('./db');

var animalSchema = new mongoose.Schema({
    name: String,
    type: String
});

//定义对象方法
animalSchema.methods.findType = function(callback) {
    this.model('Animal').find({ type: this.type }, callback);
}

var Animal = db.model('Animal', animalSchema);

module.exports = Animal;