var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
//使用cookie必须要使用cookie-parser中间件
app.use(cookieParser());
app.get('/', function(req, res) {
    //maxAge在express中是以毫秒为单位
    res.cookie('xihao', 'tfboys', {
        maxAge: 900000,
        httpOnly: true
    });
    res.send('猜你喜欢：' + req.cookies.mudidi);

});
app.get('/gonglue', function(req, res) {
    //得到get请求  用户查询的目的地
    var mudidi = req.query.mudidi;

    //记录用户喜好
    //先读取用户的喜好，然后把新的数据push进入数组，然后设置新的cookie
    var mudidiArray = req.cookies.mudidi || [];
    mudidiArray.push(mudidi);
    res.cookie('mudidi', mudidiArray, { maxAge: 900000, httpOnly: true });
    res.send(mudidi + '旅游攻略');
});
app.listen(3000);