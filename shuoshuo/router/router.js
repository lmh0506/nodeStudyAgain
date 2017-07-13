var formidable = require('formidable');
var db = require('../models/db');
var md5 = require('../models/md5');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
//首页
exports.showIndex = function(req, res, next) {
    if (req.session.login) {
        db.find('users', {
            'json': {
                'username': req.session.username,
                'password': req.session.password
            }
        }, function(err, result) {
            var avatar = result[0].avatar;
            db.find('posts', { 'sort': { 'datetime': -1 } }, function(err, result) {
                if (err) {
                    console.log(err);
                }
                res.render('index', {
                    login: req.session.login,
                    username: req.session.username,
                    active: 'index',
                    avatar: avatar,
                    shuoshuo: result
                });
            })

        })
    } else {
        res.render('index', {
            login: req.session.login,
            username: req.session.username,
            active: 'index',
            avatar: '',
            shuoshuo: []
        });
    }

}

//注册页面
exports.showRegist = function(req, res, next) {
    res.render('regist', {
        login: req.session.login,
        username: req.session.username,
        active: 'regist'
    });
}

//注册业务
exports.doRegist = function(req, res, next) {
    //得到用户填写的东西
    //查询是否存在用户名
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到表单
        var username = fields.username;
        var password = fields.password;

        db.find('users', { 'json': { 'username': username } }, function(err, result) {
            if (err) {
                res.send('-3'); //服务器错误
                return;
            } else {
                if (result.length > 0) {
                    res.send('-1'); //被占用
                } else {
                    password = md5(md5(password)) + 'lmh';
                    db.insertOne('users', {
                        'username': username,
                        'password': password,
                        'avatar': 'avatar.jpg'
                    }, function(err, result) {
                        if (err) {
                            res.send('-3');
                        } else {
                            req.session.login = true;
                            req.session.username = username;
                            req.session.password = password;
                            res.send('1');
                        }
                    })
                }
            }
        })
    })
}

//登录页面
exports.showLogin = function(req, res, next) {
    res.render('login', {
        login: req.session.login,
        username: req.session.username,
        active: 'login'
    });
}

//登录页面的执行
exports.doLogin = function(req, res, next) {
    //查询数据库  看看用户是否存在
    //用户如果存在查看密码是否正确
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到表单
        var username = fields.username;
        var password = fields.password;

        db.find('users', { 'json': { 'username': username } }, function(err, result) {
            if (err) {
                res.send('-3'); //服务器错误
                return;
            } else {
                if (result.length > 0) {
                    password = md5(md5(password)) + 'lmh';
                    if (password == result[0].password) {
                        req.session.login = true;
                        req.session.username = username;
                        req.session.password = password;
                        res.send('1');
                    } else {
                        res.send('-2');
                    }

                } else {
                    res.send('-1'); //用户不存在
                }
            }
        })
    })
}

//设置头像页面，必须保证此时是登录状态
exports.showSetAvater = function(req, res, next) {
    if (req.session.login) {
        res.render('setavater', {
            login: req.session.login,
            username: req.session.username,
            active: 'setavater'
        });
    } else {
        res.redirect('/login');
    }
}

exports.doSetAvater = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './avatar';
    form.parse(req, function(err, fields, files) {
        var oldpath = files.avater.path;
        var newpath = form.uploadDir + '/' + req.session.username + '.jpg';
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                res.send('上传失败');
            } else {
                req.session.avater = req.session.username + '.jpg';
                //跳到切的业务
                res.redirect('/qie');
            }
        })
    });
}

//显示切图页面
exports.showCut = function(req, res) {
    res.render('qie', {
        avater: req.session.avater
    });
}

//执行切图
exports.docut = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var filename = fields.filename;
        var w = fields.w;
        var h = fields.h;
        var x = fields.x;
        var y = fields.y;
        gm('./avatar/' + filename).crop(w, h, x, y).resize(100, 100, '!').write('./avatar/' + filename, function(err) {
            if (err) {
                res.send('-1');
            } else {
                //更改数据库当前用户avatar的值
                db.update('users', { 'username': req.session.username }, { 'avatar': filename }, function(err, result) {
                    if (err) {
                        res.send('-1');
                    } else {
                        res.send('1');
                    }
                })
            }
        })
    });
}

exports.doPost = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var content = fields.content;
        var username = req.session.username;
        db.insertOne('posts', {
            'username': username,
            'content': content,
            'datetime': new Date()
        }, function(err, result) {
            if (err) {
                res.send('-1');
            } else {
                res.send('1');
            }
        })
    })
}

//列出所有说说
exports.getAllShuoshuo = function(req, res, next) {
    var page = req.query.page;
    db.find('posts', { 'args': { 'limitNum': 1, 'page': page }, 'sort': { 'datetime': -1 } }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(result);
        }

    })
}

//获取用户信息
exports.getUserInfo = function(req, res, next) {
    var username = req.query.username;
    //var _callback = req.query._callback;
    db.find('users', { 'json': { 'username': username } }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var obj = {
                'username': result[0].username,
                'avatar': result[0].avatar,
                'oid': result[0]._id
            }
        //     if(_callback){
        //         res.type('text/javascript');
        //         res.send(_callback + '('+ JSON.stringify(obj) +')');
        //     }
        //     else
        //         res.json(obj)
                res.jsonp(obj)
        }
        
    })
}

//说说总数
exports.getShuoshuoAmount = function(req, res, next) {
    db.getCount('posts', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }

    })
}

//显示用户信息
exports.showUser = function(req, res, next) {
    var username = req.params['username'];
    if (req.session.login) {
        db.find('posts', { 'json': { 'username': username }, 'sort': { 'datetime': -1 } }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                db.find('users', { 'json': { 'username': username } }, function(err, result2) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('user.ejs', {
                            username: req.session.username,
                            me: username,
                            login: req.session.login,
                            active: '',
                            myShuoshuo: result,
                            myavatar: result2[0].avatar
                        })
                    }
                })
            }
        })
    } else {
        res.redirect('/login');
    }
}

//显示所有用户列表
exports.userList = function(req, res, next) {
    if (req.session.login) {
        db.find('users', function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render('userList.ejs', {
                    username: req.session.username,
                    login: req.session.login,
                    active: 'userList',
                    users: result
                })
            }
        })
    } else {
        res.redirect('/login');
    }

}