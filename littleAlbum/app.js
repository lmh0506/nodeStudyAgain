var express = require('express');
var app = express();

var router = require('./controller/router');

app.set('view engine', 'ejs');

//路由中间件
//提供静态服务  静态页面
app.use(express.static('./public'));
app.use(express.static('./uploads')); //由于上一层的中间件匹配不到uploads文件夹中的图片文件  于是把该文件夹也设置为静态资源文件夹
//首页
app.get('/', router.showIndex); //参数不用写成router.showIndex(req,res);
app.get('/up', router.showUp);
app.post('/up', router.doPost);
app.post('/create/:fileName', router.doCreate);
app.get('/:albumName', router.showAlbum);

//404
app.use(function(req, res) {
    res.render('err');
});

app.listen(3000);