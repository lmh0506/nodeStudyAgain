//这个页面不关心数据库  只关心对象
var Book = require('../models/Book');

//显示首页，就是列出所有图书
exports.showIndex = function(req, res, next) {
    Book.getAllBook(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('index.ejs', {
                book: result
            });
        }
    })
}

//添加数据界面
exports.addBook = function(req, res, next) {
    res.render('addbook.ejs');
}

//保存图书
exports.doadd = function(req, res, next) {
    Book.create(req.query, function(err) {
        if (err) {
            res.send('失败');
        } else {
            res.send('保存成功');
        }
    })
}

//修改显示
exports.edit = function(req, res, next) {
    Book.findBook(req.query.id, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('edit.ejs', {
                book: result[0]
            })
        }
    })
}

//处理修改
exports.doedit = function(req, res, next) {
    Book.updateBook({ _id: req.query.id }, { $set: { name: req.query.name, author: req.query.author, price: req.query.price } }, {}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
}

//删除
exports.delete = function(req, res, next) {
    Book.removeBook(req.query.id, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
}