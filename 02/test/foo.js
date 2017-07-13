//msg这个变量是一个js文件内部才有作用域的变量
var msg = "你好";
var info = "呵呵";
function show(){
    console.log(msg+info);
}
//如果别人想用这个变量就要用exports进行暴露
//exports可以暴露变量和函数
exports.msg = msg;
exports.info = info;
exports.show = show;