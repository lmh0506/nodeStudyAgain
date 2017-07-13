var express = require('express');
var app = express();
var db = require('./models/db');

app.get('/', function(req, res) {
    db.insertOne('student', { 'name': 'lll', age: parseInt(Math.random() * 90) + 10 }, function(err, result) {
        if (err) {
            console.log('插入失败');
            return;
        } else {
            console.log('插入成功');
        }
    });

    res.send();
});

app.get('/find', function(req, res) {
    //这个页面现在接受一个page参数
    var page = parseInt(req.query.page); //express 中读取get参数很简单
    db.getCount('student', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    db.find('student', {
            'json': {
                $or: [{ "age": 12, 'score.yinyu': { $gt: 60 } }, { 'age': { $gt: 12 } }]
            },
            'args': { 'limitNum': 3, 'page': page },
            'sort': { 'age': 1 }
        },
        function(err, result) {
            if (err) {
                res.send();
            } else {
                res.json(result);
            }

        });
});

app.get('/shan', function(req, res) {
    var age = parseInt(req.query.age);
    db.deleteMany('student', { 'name': 'lll' }, function(err, result) {
        if (err) {
            console.log('删除失败');
        } else {
            console.log('删除成功');
        }
        res.send();
    });
});

app.get('/xiugai', function(req, res) {
    db.update('student', { 'name': 'lll' }, { 'age': 18 }, function(err, result) {
        if (err) {
            console.log('修改失败');
        } else {
            console.log('修改成功');
        }
        res.send();
    });
});

app.listen(3000);