//使用者用foo来接收exports对象 也就是说 这里的foo变量 就是文件中的exports变量
var foo = require('./test/foo');
var People = require('./test/people');
console.log(foo.msg);
console.log(foo.info);
foo.show();

var xiaoming = new People('小明','男',20);
xiaoming.sayHello();