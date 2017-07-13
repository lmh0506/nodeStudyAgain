var express = require('express');
var app = express();
var db = require('./models/db');
var formidable = require('formidable');
var ObjectId = require('mongodb').ObjectID;
//设置模板引擎
app.set("view engine", 'ejs')

//静态
app.use(express.static('./public'));

//显示留言列表
app.get('/', function(req, res) {
    db.getCount('liuyanben', function(err, result) {
        res.render('index', {
            'count': Math.ceil(result / 4)
        });
    });

});

app.get('/du', function(req, res) {
    var pagesize = 4;
    var page = parseInt(req.query.page);
    db.find('liuyanben', { 'args': { 'limitNum': pagesize, 'page': page } }, function(err, result) {
        res.json({ 'result': result });
    });
})

app.get('/delete', function(req, res, next) {
    var id = req.query.id;
    console.log(id);
    db.deleteMany('liuyanben', { '_id': ObjectId(id) }, function(err, result) {
        if (err) {
            res.json({ 'result': '-1' });
            return;
        } else {
            res.json({ 'result': '1' });
        }
    });
});

//处理留言
app.post('/tijiao', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //写入数据库
        db.insertOne('liuyanben', {
            'name': fields.name,
            'liuyan': fields.liuyan
        }, function(err, result) {
            if (err) {
                res.json({ 'result': '-1' });
                return;
            } else {
                res.json({ 'result': '1' });
            }
        });
    });
});

app.listen(3000);