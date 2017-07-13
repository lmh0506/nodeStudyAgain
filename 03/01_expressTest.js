var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.send('你好');
});

app.get('/haha', function(req, res) {
    res.send('这是哈哈页面');
});

app.get(/^\/student\/([\d]{10})$/, function(req, res) {
    res.send('学生信息，学号' + req.params[0]);
});

app.get('/teacher/:gonghao', function(req, res) {
    res.send('老师信息,工号' + req.params['gonghao']);
});
app.listen(3000);