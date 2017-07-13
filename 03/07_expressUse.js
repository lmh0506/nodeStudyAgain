var express = require('express');
var fs = require('fs');
var app = express();
//当你不写路径的时候 实际上就相当于'/'  就是所有网址
app.use(function(req, res, next) {
    console.log(new Date());
    next();
});

app.use(haha);
//app.use也是一个中间件 与get和post不同 它的网址不是精确匹配的  而是能够有小文件夹扩展的
app.use('/admin', function(req, res) {
    res.write(req.originalUrl + '\n'); // /admin/aa/bb/cc/dd
    res.write(req.baseUrl + '\n'); //    /admin
    res.write(req.path + '\n'); //   /aa/bb/cc/dd
    res.end('你好');
});

function haha(req, res, next) {
    //根据当前网址 读取static文件夹中的文件
    //如果有这个文件 那么渲染文件
    //如果没有这个文件 那么next()
    var filePath = req.originalUrl;
    fs.readFile('./static/' + filePath, function(err, data) {
        if (err) {
            next();
            console.log('err');
            return;
        } else {
            res.send(data.toString());
        }
    })
}
app.listen(3000);