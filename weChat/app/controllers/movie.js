var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var Comment = mongoose.model('Comment')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var moment = require('moment')

// detail page
exports.detail = async function(ctx, next) {
  var id = ctx.params.id

  await Movie.update({_id: id}, {$inc: {pv: 1}}).exec()

  var movie = await Movie.findOne({_id: id}).exec()
  var comments = await Comment
    .find({movie: id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .exec()

  await ctx.render('pages/detail.jade', {
          title: 'imooc 详情页',
          movie: movie,
          comments: comments
        })
}

// admin new page
exports.new = async function(ctx, next) {
  var categories = await Category.find({}).exec()
  await ctx.render('pages/admin.jade', {
    title: 'imooc 后台录入页',
    categories: categories,
    movie: {}
  })
}

// admin update page
exports.update = async function(ctx, next) {
  var id = ctx.params.id
  if (id) {
    var movie = await Movie.findOne({_id: id}).exec()

    var categories = await Category.find({}).exec()
    await ctx.render('pages/admin.jade', {
      title: 'imooc 后台更新页',
      movie: movie,
      categories: categories
    })
  }
}

var util = require('../../libs/util')

// admin poster
exports.savePoster = async function(ctx, next) {
  var posterData = ctx.request.body.files.uploadPoster
  var filePath = posterData.path
  var name = posterData.name

  if (name) {
    var data = await util.readFileAsync(filePath, 'base64')
    var timestamp = Date.now()
    var type = posterData.type.split('/')[1]
    var poster = timestamp + '.' + type
    var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
    await util.writeFileAsync(newPath, data) 

    ctx.poster = poster
  }
  await next()
}

// admin post movie
exports.save = async function(ctx, next) {
  var movieObj = ctx.request.body.fields || {}
  var _movie

  if (ctx.poster) {
    movieObj.poster = ctx.poster
  }

  if (movieObj._id) {
    var movie = await Movie.findOne({_id: movieObj._id}).exec()

    _movie = _.extend(movie, movieObj)
    await _movie.save()
    ctx.response.redirect('/movie/' + movie._id)
  }
  else {
    _movie = new Movie(movieObj)

    var categoryId = movieObj.category
    var categoryName = movieObj.categoryName

    await _movie.save()
      if (categoryId) {

       var category = await Category.findOne({_id: categoryId})
          category.movies.push(movie._id)
          await category.save()
          ctx.response.redirect('/movie/' + movie._id)
      }
      else if (categoryName) {
        var category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        await category.save()
        movie.category = category._id
        await movie.save()
        ctx.response.redirect('/movie/' + movie._id)
      }
  }
}

// list page
exports.list = async function(ctx, next) {
  var movies = await Movie.find({})
    .populate('category', 'name')
    .exec()
  await ctx.render('pages/list.jade', {
      title: 'imooc 列表页',
      movies: movies,
      moment: moment
    })
}

// list page
exports.del = async function(ctx, next) {
  var id = ctx.query.id

  if (id) {
    try{
      var movie = await Movie.remove({_id: id}).exec()
      ctx.body = {success: 1}
    }catch(err){
      ctx.body = {success: 0}
    }
    
  }
}