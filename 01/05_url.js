var http = require('http');
var url = require('url');
var server = http.createServer(function(req,res){
    //url.parse()可以将一个完整的url地址 分割为很多部分
    //host 主机名,port 端口号，pathname 文件路径,path 文件路径带查询参数,query 查询参数
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url,true).query;//url.parse第二个参数为true时  返回的是一个查询对象、
    var name = query.name;
    var age = query.age;
    var sex = query.sex;
    console.log('pathname : ' +pathname);
    //console.log('query : '+ query);
    console.log('name :'+name+',age :'+age+',sex :'+sex);
    res.end();
});

server.listen(3000);