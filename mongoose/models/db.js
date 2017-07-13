//引包
var mongoose = require('mongoose');
//创建数据库连接
var db = mongoose.createConnection('mongodb://localhost/lll');
//监听open事件
db.once('open', function(callback) {
    console.log('数据库成功连接');
});

module.exports = db;