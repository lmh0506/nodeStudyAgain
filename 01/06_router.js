var http = require('http');

var server = http.createServer(function(req,res){
    //得到url
    var userUrl = req.url;
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'})
    //substr函数来判断此时的开头
    if(userUrl.substr(0,9) == '/student/'){
        var studentid = userUrl.substr(9);
        if(/^\d{10}$/.test(studentid)){
            res.end('您要查询的学生信息，id为'+studentid);
        }else{
            res.end('学生学号位数不对');
        }
    }else if(userUrl.substr(0,9) == '/teacher/'){
        var teacherid = userUrl.substr(9);
        if(/^\d{6}$/.test(teacherid)){
            res.end('您要查询的教师信息，id为'+teacherid);
        }else{
            res.end('教师学号位数不对');
        }
    }else{
        res.end('404  页面丢失了');
    }

});
server.listen(3000);