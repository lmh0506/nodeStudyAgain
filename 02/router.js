exports.showIndex = function(req,res){
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.end('我是首页');
}

exports.showStudent = function(req,res){
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.end('我是学生');
}

exports.show404 = function(req,res){
    res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
    res.end('404，页面丢失了');
}