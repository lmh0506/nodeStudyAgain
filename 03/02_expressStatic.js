var express = require('express');
var app = express();
//设置静态资源文件夹
app.use(express.static('./static'));

app.get('/haha', function(req, res) {
    res.send('haha');
});
app.listen(3000);