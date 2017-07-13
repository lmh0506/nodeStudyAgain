var http = require('http');
var querystring = require('querystring');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var path = require('path');
var server = http.createServer(function(req,res){
    //如果你访问的地址是这个，并且请求类型是post
    if(req.url == '/dopost' && req.method.toLowerCase() == 'post'){
        //创建一个新的输入表单
        var form = formidable.IncomingForm();
        //保留上传文件的后缀名
        form.keepExtensions = true;
        //设置文件上传存放的地址
        form.uploadDir = './uploads';
        //执行里面的回调函数的时候 表单已经全部接受完毕
        form.parse(req,function(err,fields,files){
            //所有的文本域，单选框都在fields里面存放
            //所有的文件域 都在files中存放
            if(err){
                throw err;
            }else{
                res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
                //获取扩展名
                var extname = path.extname(files.files.name);
                var oldPath = __dirname + '/' + files.files.path;
                var newPath = __dirname + '/uploads/' + parseInt(Math.random()*89999 +10000) + extname;
                //执行改名
                fs.rename(oldPath,newPath,function(err){
                    if(err){
                        throw Error('改名失败');
                    }
                })

                res.write('接受完毕');
                console.log(fields);
                console.log(files);
                res.end(util.inspect({fields:fields,files:files}));
            }
            
        });
    }else if(req.url == '/'){
        fs.readFile('./static/form.html',function(err,data){
            if(err){
                throw err;
            }else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                res.end(data);
            }
        })
    }else{
        fs.readFile('./static/404.html',function(err,data){
            if(err){
                throw err;
            }else{
                res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
                res.end(data);
            }
        })
    }


});
server.listen(3000);