var express = require('express');
var app = express();
var router = require('./router/router');
var Blog = require('./models/Blog');
var Animal = require('./models/Animal');
var Student = require('./models/Student');
var Course = require('./models/Course');

app.set('view engine', 'ejs')

app.get('/', router.showIndex);

app.get('/addbook', router.addBook);
app.get('/doadd', router.doadd);

app.get('/edit', router.edit);
app.get('/doedit', router.doedit);

app.get('/delete', router.delete);

/*var lmh = new Blog({ title: 'lmh', author: 'lmh', body: '博客内容' });
//lmh.save();

var blog = new Blog({ title: 'test', author: 'lmh', body: 'content' });
blog.pinglun({ body: 'comment', date: new Date() });

//保存评论
Blog.findOne({ title: 'lmh' }, function(err, blog) {
    if (err) {
        console.log(err);
    } else {
        if (!blog) {
            return;
        } else {
            console.log(blog);
            blog.pinglun({ body: '哈哈哈', date: new Date() });
        }
    }
})*/

//测试数据
/*Animal.create({ name: 'tom', type: 'cat' });
Animal.create({ name: 'mm', type: 'cat' });
Animal.create({ name: 'sw', type: 'dog' });
Animal.create({ name: 'snoopy', type: 'dog' });*/

//寻找同类
/*var lmh = new Animal({ name: 'lmh', type: 'cat' });
lmh.findType(function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
})*/

//测试数据
/*Student.create({ 'name': 'lmh', age: 22, 'sex': 'man' });
Student.create({ 'name': 'lll', age: 12, 'sex': 'man' });
Student.create({ 'name': 'lin', age: 23, 'sex': 'man' });
Student.create({ 'name': 'fl', age: 18, 'sex': 'woman' });*/

/*var xiaohong = new Student({
    name: '小红',
    age: 12,
    sex: 'woman'
});
xiaohong.save();
var math = new Course({
    name: '英语课',
    info: '学习英语'
});

math.addStudent(xiaohong, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
})*/

Course.findOne({ name: '英语课' }, function(err, result) {
    result.student[0].addAge();
    result.save();
})

app.listen(3000);