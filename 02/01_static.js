var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var server = http.createServer(function(req,res){
    //得到用户路径
    var pathname = url.parse(req.url).pathname;
    //默认首页
    if(pathname == '/'){
        pathname = 'index.html';
    }

    //拓展名
    var extname = path.extname(pathname);

    //真的读取这个文件
    fs.readFile('./static/' + pathname,function(err,data){
        if(err){
            //如果此文件不存在 就应该返回404
            fs.readFile('./static/404.html',function(err,data){
                res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
                res.end(data);
            });
            
        }else{
            getMime(extname,function(mime){
                res.writeHead(200,{'Content-Type':mime+';charset=utf-8'});
                res.end(data);
            });
            
        }

    });
});

server.listen(3000);

function getMime(extname,res){
    /*switch(extname){
        case '.html':return 'text/html';break;
        case '.jpg' :return 'image/jpg';break;
        case '.css':return 'text/css';break;
    }*/
    //读取mime.json文件  得到json 根据extname key 返回对应的value
    //读取文件
    fs.readFile('./mime.json',function(err,data){
        if(err){
            throw Error('找不到mime.json文件！');
        }else{
            //转成json
            var mimeJson = JSON.parse(data);
            var mime = mimeJson[extname] || 'text/plain';
            console.log(mimeJson[extname]);
            //执行回调函数 mime类型字符串 就是它的参数
            res(mime);
        }
    })
}