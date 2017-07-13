var express = require('express');
var app = express();

//静态服务  一般往上写
app.use(express.static('./static'));
//app.use('/jingtai', express.static('./static'));  http://localhost:3000/jingtai/
//新的路由
app.get('/', function(req, res) {
    res.send('哈哈');
});
//如果没有匹配的路由就进入404界面
app.use(function(req, res) {
    //404界面
    res.status(404).send('404  页面丢失了');
});
app.listen(3000);