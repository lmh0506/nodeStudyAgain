var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/', function(req, res) {
    //post请求在express中不能直接获得 必须使用body-parser模块 使用后 将可以使用req.body得到参数
    //但是如果表单上传中含有文件上传 那么还是需要使用formidable模块
    console.log(req.body);
})

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    //get请求的参数在url中 
    //在原生node中  需要使用url模块来识别参数字符串 
    //在express中不需要使用url模块 可以直接使用req.query对象
    console.log(req.query);
    res.render('form');
})



app.listen(3000);