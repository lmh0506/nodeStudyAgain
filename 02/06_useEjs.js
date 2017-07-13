var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var server = http.createServer(function(req, res) {
    fs.readFile('./views/index.ejs', function(err, data) {
        //读取模板文件并转为字符串
        var template = data.toString();
        //应用于模板的数据
        var dictionary = {
            a: 6,
            news: ['one', 'two', 'three'],
            obj: [
                { 'title': 'one', 'num': 1 },
                { 'title': 'two', 'num': 2 },
                { 'title': 'three', 'num': 3 },
            ]
        };
        //数据绑定
        var html = ejs.render(template, dictionary);
        //显示
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(html);
    });
}).listen(3000);


/*//模板
var string = '我买了一个iphone <%=a %>s';
//数据
var data = {
    a: 6
};
//数据绑定
var html = ejs.render(string, data);
//输出
console.log(html);*/