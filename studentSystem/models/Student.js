var mongoose = require('mongoose');
var db = require('./db');

var studentShema = new mongoose.Schema({
    'sid': Number,
    'name': String,
    'age': Number,
    'sex': String,
    'courses': [Number] //存放课程的id
});

//索引
studentShema.index({ 'sid': 1 });

var Student = db.model('Student', studentShema)

module.exports = Student;