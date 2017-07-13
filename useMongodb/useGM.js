var fs = require('fs'),
    gm = require('gm');

gm('./public/img/404.jpg')
    .resize(50, 50, '!') //加叹号无视宽高比
    .write('./public/img/test.jpg', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('done');
        }
    });

//裁剪图片
gm('./public/img/404.jpg')
    .crop(100, 75, 50, 50) //前面的两个参数是宽高  后面两个是坐标
    .write('./public/img/test.jpg', function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log('done');
        }
    })