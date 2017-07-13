var mongoose = require('mongoose');
var db = require('./db');
var Student = require('./Student');

var courseSchema = new mongoose.Schema({
    'name': String,
    'info': String,
    'student': [Student.schema]
})

courseSchema.methods.addStudent = function(studentObj, callback) {
    this.student.push(studentObj);
    this.save(function() {
        callback();
    });
    callback();
}

var Course = db.model('Course', courseSchema);

module.exports = Course;