var express = require('express');
var app = express();
var session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.get('/', function(req, res) {
    if (req.session.login) {
        res.send('欢迎你' + req.session.username);
    } else {
        res.send('请先登录');
    }
})
app.get('/login', function(req, res) {
    req.session.login = true; //设置session
    req.session.username = 'lmh';
    res.send('你已经成功登陆');
})

app.listen(3000);