var Koa = require('koa')
var mongoose = require('mongoose')
var fs = require('fs')
var dbUrl = 'mongodb://localhost/imooc'
var moment = require('moment')

mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

var menu = require('./wx/menu')
var wx = require('./wx/index')
var wechatApi = wx.getWechat()

wechatApi.deleteMenu()
  .then(function(){
    return wechatApi.createMenu(menu)
  })
  .then(function(msg){
    console.log(msg)
  })

var app = new Koa()
var Router = require('koa-router')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var router = new Router()
var User = mongoose.model('User')

app.keys = ['imooc']
app.use(session(app))
app.use(bodyParser())

app.use(async (ctx, next) => {
  var user = ctx.session.user
  if(user && user._id){
    ctx.session.user = await User.findOne({_id: user._id}).exec()
    ctx.state.user = ctx.session.user
  }else{
    ctx.state.user = null
  }

  await next()
})

var views = require('koa-views')
app.use(views(__dirname + '/app/views', {
  map: {
    html: 'jade'
  },
  locals: {
    moment: moment
  }
}))

require('./config/routes')(router)


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000)
