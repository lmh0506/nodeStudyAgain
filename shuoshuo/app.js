var express = require('express');
var app = express();
var router = require('./router/router');
var session = require('express-session');
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
//模板引擎
app.set('view engine', 'ejs');

//静态页面
app.use(express.static('./public'));
app.use(express.static('./avatar'));
//路由表
app.get('/', router.showIndex);

app.get('/regist', router.showRegist);

app.post('/doregist', router.doRegist);

app.get('/login', router.showLogin);
app.post('/dologin', router.doLogin);

app.get('/setavater', router.showSetAvater);
app.post('/dosetavater', router.doSetAvater);

app.get('/qie', router.showCut);
app.post('/docut', router.docut);

//发表说说
app.post('/post', router.doPost);

app.get('/getAllShuoshuo', router.getAllShuoshuo); //Ajax服务  列出所有说说
app.get('/getUserInfo', router.getUserInfo);
app.get('/getShuoshuoAmount', router.getShuoshuoAmount);
app.get('/user/:username', router.showUser);
app.get('/userList', router.userList);
app.listen(1128);