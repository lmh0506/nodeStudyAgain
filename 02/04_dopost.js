var http = require('http');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
    //如果你访问的地址是这个，并且请求类型是post
    if(req.url == '/dopost' && req.method.toLowerCase() == 'post'){
        var alldata = '';
        //下面是post请求接收的一个公式
        //node为了追求极致 它是一个小段一个小段接收的
        //接收了一小段 可能就是给别人服务去了 防止一个过大的表达阻塞了整个过程
        req.addListener('data',function(chunk){
            alldata += chunk;
            console.log(chunk);
        });
        //全部传输完毕
        req.addListener('end',function(){
            var dataString = alldata.toString();
            var dataJson = querystring.parse(dataString);
            console.log(dataString);
            console.log(dataJson);
            
            res.end('success');
        });
    }


});
server.listen(3000);