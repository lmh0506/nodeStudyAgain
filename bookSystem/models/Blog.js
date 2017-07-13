var mongoose = require('mongoose');
var db = require('./db');

var blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
});

//发表评论
blogSchema.methods.pinglun = function(obj, callback) {
    this.comments.push(obj);
    this.save();
}

/*blogSchema.statics.findOne = function(json, callback) {
    this.find(json, callback);
}*/

var Blog = db.model('Blog', blogSchema);

module.exports = Blog;