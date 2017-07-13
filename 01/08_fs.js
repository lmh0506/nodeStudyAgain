var http = require('http');
var fs = require('fs');


var server = http.createServer(function(req,res){
    //不处理小图标
    if(req.url == '/favicon.ico'){
        return;
    }
    //创建aaa文件夹
   /* fs.mkdir('./test/bb',function(err){
        if(err){
            throw err;
        }else{
            console.log('创建成功');
        }
        
    });*/

    //stat检测状态
    fs.stat('./test/aaa',function(err,data){
        //检测这个路径是不是一个文件夹
        if(err){
            throw err;
        }else{
            console.log(data.isDirectory());
        }
        
    });

    fs.readdir('./test',function(err,files){
        //files是个文件名数组 并不是文件数组 表示./test这个文件夹中的所有东西
        if(err){
            throw err;
        }else{
            var length = files.length;
            for(var i = 0; i<length;i++)
            {
                var dir = './test/'+files[i];

                var data = fs.statSync(dir);
                //如果他是一个文件夹就输出它
                if(data.isDirectory())
                    console.log(files[i]);
                    
            }
            console.log(files);
        }
    });
    res.end();
});

server.listen(3000);