//这个模块里面封装了所有数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
var settings = require('./settings.js');
//不管数据库什么操作 都是先连接数据库  所以我们可以把连接数据库封装成函数

function _connectionDB(callback) { //callback  是数据库连接成功后要执行的函数
    var url = settings.dburl;
    //连接数据库
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('数据库连接失败');
            db.close();
            return;
        } else {
            console.log('数据库连接成功');
            callback(db);
            db.close();
            console.log('数据库已关闭');
        }
    });
}

//插入数据
exports.insertOne = function(collectionName, json, callback) {
    _connectionDB(function(db) {
        db.collection(collectionName).insertOne(json, callback); //collectionName  是被插入的集合名称 json是插入的数据  callback是插入成功后执行的函数
    });
}

//查找数据,找到所有数据  args是一个对象存储分页条件  sort是排序的条件
exports.find = function(collectionName, b, c) {
    var result = [];
    if (arguments.length == 2) {
        var callback = b;
        var json = {};
        var args = { 'limitNum': 0, 'page': 0 };
        var sort = { "_id": 1 };
    } else if (arguments.length == 3) {
        var findJson = b;
        var callback = c;
        var json = findJson.json || {};
        var args = findJson.args || { 'limitNum': 0, 'page': 0 };
        var sort = findJson.sort || {};
    } else {
        throw Error('输入的参数有误');
    }

    var limitNum = args.limitNum; //每页显示的个数
    var skipNum = args.page * args.limitNum; //跳过的个数
    _connectionDB(function(db) {
        var cursor = db.collection(collectionName).find(json).limit(limitNum).skip(skipNum).sort(sort);
        cursor.each(function(err, doc) {
            if (doc != null) {
                result.push(doc); //放入结果数组
            } else {
                //遍历结束  没有更多的文档
                callback(null, result);
            }
        });
    });
}

//获取查询数据的总数
exports.getCount = function(collectionName, b, c) {
    if (arguments.length == 2) {
        var json = {};
        var callback = b;
    } else if (arguments.length == 3) {
        var json = b;
        var callback = c;
    } else {
        throw Error('输入的参数有误');
    }
    _connectionDB(function(db) {
        db.collection(collectionName).count(json, callback);
    })
}

//删除数据
exports.deleteMany = function(collectionName, json, callback) {
    _connectionDB(function(db) {
        db.collection(collectionName).deleteMany(json, callback);
    });
}

//修改数据
exports.update = function(collectionName, json1, json2, callback) {
    _connectionDB(function(db) {
        db.collection(collectionName).updateMany(json1, { $set: json2 }, callback);
    })
}