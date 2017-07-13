var mongoose = require('mongoose');
var db = require('./db');
var ObjectId = require('mongodb').ObjectId;
//结构
var bookSchema = new mongoose.Schema({
    name: { type: String },
    author: { type: String },
    price: { type: Number },
    type: { type: Array, default: '' }
});

//给schema增加几个方法  类方法
//通过id找书
bookSchema.statics.findBook = function(id, callback) {
    this.find({ _id: ObjectId(id) }, callback);
}

//查找所有图书
bookSchema.statics.getAllBook = function(callback) {
    this.find(callback);
}

//更新图书
bookSchema.statics.updateBook = function(conditions, update, option, callback) {
    this.update(conditions, update, option, callback);
}

//删除图书
bookSchema.statics.removeBook = function(id, callback) {
    this.remove({ _id: ObjectId(id) }, callback);
}

//模型  模型需要用到schema
var bookModel = db.model('Book', bookSchema)

module.exports = bookModel;