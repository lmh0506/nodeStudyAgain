var http = require('http');
var fs = require('fs');


var server = http.createServer(function(req,res){
    //不处理小图标
    if(req.url == '/favicon.ico'){
        return;
    }
    var userId = parseInt(Math.random()*89999)+10000;
    console.log('欢迎'+userId);
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    //第一个参数是完整路径  当前目录写./
    //第二个参数是回调函数 表示文件读取成功之后 做的事情
    fs.readFile('./test/1.txt',{"charset":'utf-8'},function(err,data){
        if(err){
            throw err;
        }
        res.end(data);
        console.log(userId+'文件读取完毕');
    });
});

server.listen(3000);