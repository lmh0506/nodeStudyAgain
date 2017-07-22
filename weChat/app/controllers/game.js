var mongoose = require('mongoose')
var User = mongoose.model('User')
var Comment = mongoose.model('Comment')

var wechat = require('../../wechat/g')
var reply = require('../../wx/reply')
var wx = require('../../wx/index')
var util = require('../../libs/util')
var Movie = require('../api/movie')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

exports.jump = async function(ctx, next){
  var movieId = ctx.params.id
  var redirect = 'http://d41bb9fc.ngrok.io/wechat/movie/' + movieId
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ wx.wechatOptions.wechat.appID +'&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state='+ movieId +'#wechat_redirect '

  ctx.redirect(url)
}

exports.movie = async function (ctx, next){
    
    var wechatApi = wx.getWechat()
    var data = await wechatApi.fetchAccessToken()
    var access_token = data.access_token
    var ticketData = await wechatApi.fetchTicket(access_token)
    var ticket = ticketData.ticket
    var url = ctx.href
    var params = util.sign(ticket, url)

    console.log(params)
    await ctx.render('wechat/game.jade', params)
}

exports.movieShow = async function (ctx, next){
    var code = ctx.query.code
    var openUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ wx.wechatOptions.wechat.appID +'&secret='+ wx.wechatOptions.wechat.appSecret +'&code=' + code + '&grant_type=authorization_code'
    var response = await request({url: openUrl, json: true})
    var body = response.body
    var openid = body.openid
    var user = await User.findOne({openid: openid}).exec()

    if(!user){
      user = new User({
        openid: openid,
        password: '123',
        name: Math.random().toString(36).substr(2)
      })

      user = await user.save()
    }

    ctx.session.user = user
    ctx.state.user = user
    console.log(ctx.session.user)

    var id = ctx.params.id
    var wechatApi = wx.getWechat()
    var data = await wechatApi.fetchAccessToken()
    var access_token = data.access_token
    var ticketData = await wechatApi.fetchTicket(access_token)
    var ticket = ticketData.ticket
    var url = ctx.href
    var params = util.sign(ticket, url)
    var movie = await Movie.searchById(id)
    params.movie = movie;
    params.user = ctx.session.user

    var comments = await Comment
    .find({movie: id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .exec()

    params.comments = comments

    console.log(params)
    await ctx.render('wechat/movie.jade', params)
}
