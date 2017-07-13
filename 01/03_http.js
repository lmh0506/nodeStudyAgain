//这个案例简单的讲解http模块
//引用模块
var http = require('http');

//创建一个服务器 回调函数表示收到请求之后做的事情
var server = http.createServer(function(req,res){
    //req参数表示请求  res表示响应
     res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
     res.write('<h1>标题1</h1>');
     res.write('<h2>标题2</h2>');
     res.write((1+2+3).toString());//返回必须是字符串且在end之前
     res.end('<h3>标题3</h3>');
});
server.listen(3000);
