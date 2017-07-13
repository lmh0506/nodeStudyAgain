var mongoose = require('mongoose');
var db = require('./db');

var courseSchema = new mongoose.Schema({
    'kid': Number,
    'name': String,
    'students': [Number] //这个数组存放的是学生的sid
})
courseSchema.statics.addStu = function(kidArr, sid, callback) {
    for (var i = 0; i < kidArr.length; i++) {
        this.update({ 'kid': kidArr[i] }, { $push: { 'students': sid } }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback();
            }
        })
    }
}

//索引
courseSchema.index({ 'kid': 1 });

var Course = db.model('Course', courseSchema);

module.exports = Course;