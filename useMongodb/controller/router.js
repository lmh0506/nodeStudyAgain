var file = require('../models/file');
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