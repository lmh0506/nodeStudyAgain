var express = require('express');
var app = express();
//如果我的get 、 post回调函数中没有next参数  name就匹配第一个路由 就不会往下匹配了
//如果想往下匹配的话 那么需要写next()
app.get('/', function(req, res, next) {
    console.log('1');
    //next();
});

app.get('/', function(req, res) {
    console.log('2');
});
//下面两个路由看起来感觉没有关系
app.get('/:username/:id', function(req, res) {
    res.send('用户信息' + req.params.username);
});

app.get('/admin/login', function(req, res) {
    res.send('管理员登录');
});
//但是实际上冲突了  因为admin可以当做username  login可以当做id
//解决方法1：交换位置 也就是说 express中所有的路由(中间件)的顺序至关重要
//匹配上第一个就不会往下匹配了  具体的往上写 抽象的往下写

//路由get、post这些东西就是中间件 中间件讲究顺序 匹配上第一个后就不会往后匹配了  next函数才能继续往后匹配

app.listen(3000);