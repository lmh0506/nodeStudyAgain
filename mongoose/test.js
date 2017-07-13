//引包
var mongoose = require('mongoose');

//链接数据库  lll是数据库名字
mongoose.connect('mongodb://localhost/lll');

//创建了一个模型，猫的模型 所有的猫都有名字  是字符串  类
var Cat = mongoose.model('Cat', { name: String });
//实例化一只猫
var kitty = new Cat({ name: 'test' });

kitty.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('lll');
    }
})

var tom = new Cat({ 'name': 'tom' });
tom.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('lll');
    }
})