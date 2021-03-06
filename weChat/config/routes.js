
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
var game = require('../app/controllers/game')
var wechat = require('../app/controllers/wechat')
var koaBody = require('koa-body')

module.exports = function(router) {

  // Index
  router.get('/', Index.index)

  // User
  router.post('/user/signup', User.signup)
  router.post('/user/signin', User.signin)
  router.get('/signin', User.showSignin)
  router.get('/signup', User.showSignup)
  router.get('/logout', User.logout)
  router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

  // wechat
  router.get('/wx', wechat.hear)
  router.post('/wx', wechat.hear)
  router.get('/wechat/movie', game.movie)
  router.get('/wechat/movie/:id', game.movieShow)
  router.get('/wechat/jump/:id', game.jump)

  // Movie
  router.get('/movie/:id', Movie.detail)
  router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  router.post('/admin/movie', User.signinRequired, User.adminRequired, koaBody({multipart: true}),Movie.savePoster, Movie.save)
  router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  router.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

  // Comment
  router.post('/user/comment', User.signinRequired, Comment.save)

  // Category
  router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
  router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
  router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

  // results
  router.get('/results', Index.search)
}