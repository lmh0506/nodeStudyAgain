var express = require('express');
var app = express();
//不区分大小写
app.get('/ABC', function(req, res) {
    res.send('你好');
});
//未知部分用圆括号分组 然后可以用req.params[0]、[1]得到
app.get(/^\/student\/([\d]{10})$/, function(req, res) {
    res.send('学生信息，学号' + req.params[0]);
});

app.get('/teacher/:gonghao', function(req, res) {
    var id = req.params['gonghao'];
    if (/^[\d]{6}$/.test(id)) {
        res.send('老师信息,工号' + req.params['gonghao']);
    } else {
        res.send('老师输入的工号格式有误');
    }

});

app.listen(3000);