var mongoose = require('mongoose');
var db = require('./db');

var studentSchema = new mongoose.Schema({
    'name': String,
    'age': Number,
    'sex': String
});

studentSchema.methods.addAge = function() {
    this.age++;
    this.save();
}

var Student = db.model('Student', studentSchema);

module.exports = Student;