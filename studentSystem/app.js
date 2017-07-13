var express = require('express');
var app = express();
var router = require('./router/router');

app.set('view engine', 'ejs');

app.get('/', router.showIndex);
app.get('/add', router.showAdd);
app.get('/doadd', router.doadd);
app.get('/edit/:id', router.edit)
app.get('/doedit/:sid', router.doedit)
app.get('/remove/:sid', router.remove);
app.listen(3000);