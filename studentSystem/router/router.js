var Student = require('../models/Student');
var Course = require('../models/Course');

/*Course.create({ 'kid': 001, 'name': '语文' });
Course.create({ 'kid': 002, 'name': '数学' });
Course.create({ 'kid': 003, 'name': '英语' });*/

exports.showIndex = function(req, res, next) {
    Student.find({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                students: result
            })
        }
    })

}

exports.showAdd = function(req, res, next) {
    //先查询有多少种课程
    Course.find({}, function(err, result) {
        res.render('add', {
            courses: result
        })
    })

}

exports.doadd = function(req, res, next) {
    Student.create(req.query, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            Course.addStu(req.query.courses, req.query.sid, function() {

            })
            res.redirect('/');
        }
    })
}

exports.edit = function(req, res, next) {
    var sid = req.params['id'];
    Student.find({ 'sid': sid }, function(err, result) {
        Course.find({}, function(err, result2) {
            res.render('edit', {
                students: result,
                courses: result2
            })
        })

    })

}

exports.doedit = function(req, res, next) {
    var sid = req.params['sid'];
    Student.update({ 'sid': sid }, { $set: req.query }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            Course.addStu(req.query.courses, req.query.sid, function() {

            })
            res.redirect('/');
        }
    })
}

exports.remove = function(req, res, next) {
    var sid = req.params['sid'];
    Student.remove({ 'sid': sid }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
}