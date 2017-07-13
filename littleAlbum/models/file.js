var fs = require('fs');
//获取所有文件夹
//node全是回调函数 所以我们自己封装的函数 里面如果有异步  比如I/O 那么就要用回调函数的方法封装
exports.getAllAlbums = function(callback) {
    fs.readdir('./uploads', function(err, files) {
        if (err) {
            callback('没有找到uploads文件夹', null);
        } else {
            var allAlbums = [];
            for (var i = 0; i < files.length; i++) {
                var file = fs.statSync('./uploads/' + files[i]);
                if (file.isDirectory()) {
                    allAlbums.push(files[i]);
                }
            }
            callback(null, allAlbums);
        }

    });
}

//通过文件名获取所有文件
exports.getAllImagesByAlbumName = function(albumName, callback) {
    fs.readdir('./uploads/' + albumName, function(err, files) {
        if (err) {
            callback('没有找到' + albumName + '文件', null);
        } else {
            var allImages = [];
            for (var i = 0; i < files.length; i++) {
                var file = fs.statSync('./uploads/' + albumName + '/' + files[i]);
                if (file.isFile()) {
                    allImages.push(files[i]);
                }
            }
            callback(null, allImages);
        }

    });
}