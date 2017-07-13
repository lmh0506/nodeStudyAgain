var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//创建数据库连接
var db = mongoose.createConnection('mongodb://localhost/bookSystem');
//监听open事件
db.once('open', function(callback) {
    console.log('数据库连接成功');
});

module.exports = db;