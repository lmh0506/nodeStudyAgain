var http = require('http');
var router = require('./router');
var url = require('url');
var server = http.createServer(function(req,res){
    var pathname = url.parse(req.url).pathname;
    if(pathname == '/')
    {
        router.showIndex(req,res);
    }else if(pathname == '/student'){
        router.showStudent(req,res);
    }else{
        router.show404(req,res);
    }
});
server.listen(3000);
