var db = require('./models/db');
//定义了一个模型，学生模型  学生类
var Student = require('./models/Student');
//实例化了一个学生类
/*var lmh = new Student({
    'name': 'lmh',
    'age': 12,
    'sex': lmh
});
//保存学生类
lmh.save(function() {
    console.log('存储成功');
});*/

//用类创建对象
/*Student.create({ 'name': 'fl', 'age': 11, 'sex': '女' }, function(err) {
    console.log('存储成功');
});*/

Student.updateAge({ 'name': 'lmh' }, { $set: { 'age': 30 } }, {}, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('修改成功');
    }
})

Student.findByName('lmh', function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }

})