//exports暴露一个类
function People(name,sex,age){
    this.name = name;
    this.sex = sex;
    this.age = age;
}
People.prototype = {
    sayHello:function(){
        console.log(this.name + this.sex + this.age);
    }
}
//此时People就被视为构造函数 可以用new来实例化了 都是前面必须加module
module.exports = People;