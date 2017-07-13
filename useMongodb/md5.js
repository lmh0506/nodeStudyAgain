var express = require('express');
var app = express();
var db = require('./models/db');
var session = require('express-session');
var crypto = require('crypto');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    if (req.session.login) {
        var username = req.session.username;
        var password = req.session.password;

        db.find('user', { 'json': { 'username': username } }, function(err, result) {
            if (result.length == 0) {
                res.send('用户名不存在');
            } else {
                console.log(result[0].password, password);
                if (password == result[0].password) {
                    res.send('登陆成功，你是' + result[0].username);
                } else {
                    res.send('密码错误');
                }
            }
        });
    } else {
        res.send('请先登录');
    }
})

app.get('/login', function(req, res) {
    res.render('login');
});
app.get('/reg', function(req, res) {
    res.render('reg');
});
app.get('/doreg', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');

    db.find('user', { 'json': { 'username': username } }, function(err, result) {
        if (result.length == 1) {
            res.send('用户名已存在');
        } else {
            db.insertOne('user', { 'username': username, 'password': password }, function(err, result) {
                if (err) {
                    res.send('注册失败');
                } else {
                    res.send('注册成功');
                }
            })
        }
    });
});
app.get('/checklogin', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');
    //根据用户填写的姓名，去数据库里面找这个文档  读取密码
    //如果读取的密码和填写的一样  登陆成功
    //如果读取的密码和填写的不一样  登陆失败
    //如果根本没有找到这个记录  那么就说么用户名填写错了
    db.find('user', { 'json': { 'username': username } }, function(err, result) {
        if (result.length == 0) {
            res.send('用户名不存在');
        } else {
            if (password == result[0].password) {
                req.session.login = true;
                req.session.username = username;
                req.session.password = password;
                res.send('登陆成功，你是' + result[0].username);
            } else {
                res.send('密码错误');
            }
        }
    });
})
app.listen(3000);