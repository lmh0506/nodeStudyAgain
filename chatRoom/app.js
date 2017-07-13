var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('express-session');
var allUser = [];
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
//显示首页
app.get('/', function(req, res, next) {
    res.render('index');
});

//确定登录,检查此人是否有用户名
app.get('/check', function(req, res, next) {
    var username = req.query.username;
    if (!username) {
        res.send('必须填写用户名');
        return;
    } else if (allUser.indexOf(username) != -1) {
        res.send('用户名被占用');
        return;
    } else {
        allUser.push(username);
        req.session.name = username;
        res.redirect('/chatroom');
    }

})

app.get('/chatroom', function(req, res, next) {
    if (!req.session.name) {
        res.redirect('/');
    } else {
        res.render('chatroom', {
            'username': req.session.name
        });
    }

})

io.on('connection', function(socket) {
    socket.on('chat', function(msg) {
        io.emit('chat', msg);
    })
})

http.listen(3000);