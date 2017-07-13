var express = require('express');

var app = express();

//设置模板引擎是ejs
app.set('view engine', 'ejs');
//app.set('views','files');  设置渲染文件所处文件夹为files
app.get('/', function(req, res) {
    //默认的渲染文件所处文件夹为views

    res.render('index', { //渲染index.ejs  后缀名可以省略
        a: 6,
        news: ['one', 'two', 'three'],
        obj: [
            { 'title': 'one', 'num': 1 },
            { 'title': 'two', 'num': 2 },
            { 'title': 'three', 'num': 3 }
        ]
    })
});
app.listen(3000);