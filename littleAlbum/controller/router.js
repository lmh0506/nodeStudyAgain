var file = require('../models/file');
var formidable = require('formidable');
var fs = require('fs');
//首页
exports.showIndex = function(req, res, next) {
    file.getAllAlbums(function(err, albums) {
        if (err) {
            next(); //交给下一个匹配路由处理
        } else {
            res.render('index', {
                'albums': albums
            });
        }
    });
}

//相册页
exports.showAlbum = function(req, res, next) {
    //遍历相册中的所有图片
    var albumName = req.params.albumName;
    //具体业务交给model
    file.getAllImagesByAlbumName(albumName, function(err, imagesArr) {
        if (err) {
            next(); //交给下一个匹配路由处理
        } else {
            res.render('album', {
                'albumName': albumName,
                'images': imagesArr
            });
        }
    });
}

//上传页面
exports.showUp = function(req, res, next) {
    file.getAllAlbums(function(err, album) {
        if (err) {
            next();
        } else {
            res.render('up', {
                albums: album
            });
        }
    });
}

//上传表单
exports.doPost = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        //改名
        if (err) {
            next();
            return;
        } else {
            var oldPath = files.tupian.path;
            var newPath = form.uploadDir + '/' + fields.wenjianjia + '/' + files.tupian.name;
            //判断图片尺寸
            var size = parseInt(files.tupian.size);
            if (size > 1024 * 1024) {
                //删除文件
                fs.unlink(oldPath);
                res.send('图片应小于1M');
            } else {
                fs.rename(oldPath, newPath, function(err) {
                    if (err) {
                        res.send('改名失败');
                    } else {
                        res.send('成功');
                    }
                });
            }
        }
        console.log(fields);
        console.log(files);
    });

}

//创建文件夹
exports.doCreate = function(req, res, next) {
    var fileName = req.params.fileName;
    fs.mkdir('./uploads/' + fileName, function(err) {
        if (err) {
            res.send('创建失败');
        } else {
            file.getAllAlbums(function(err, album) {
                if (err) {
                    next();
                } else {
                    res.json(album);
                }
            });
        }
    });
}