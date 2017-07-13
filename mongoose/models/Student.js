var mongoose = require('mongoose');
var db = require('./db');

//创建了一个schema结构
var studentSchema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
    sex: { type: String }
});

//创建查询静态方法
studentSchema.statics.findByName = function(name, callback) {
    this.find({ name: name }, callback);
}

//创建修改的静态方法
studentSchema.statics.updateAge = function(conditions, update, option, callback) {
    this.update(conditions, update, option, callback);
}

//创建了一个模型  就是学生模型  就是学生类
//类是基于schema创建的
var studentModel = db.model('Student', studentSchema);

module.exports = studentModel;