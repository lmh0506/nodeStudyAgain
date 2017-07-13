var express = require('express');
var app = express();
//设置模板引擎
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('form');
});

app.post('/', function(req, res) {
    //将数据添加进数据库

    res.send('成功');
});
//适合进行RESTful路由设计  简单说就是一个路径  但是http的method不同 对这个页面的使用也不同
//   /student/123456
//  get 读取学生信息
//  add 添加学生信息
//  delete 删除学生信息
app.listen(3000);