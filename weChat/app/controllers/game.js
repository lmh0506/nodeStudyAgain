

var wechat = require('../../wechat/g')
var reply = require('../../wx/reply')
var wx = require('../../wx/index')
var util = require('../../libs/util')
var Movie = require('../api/movie')

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
    console.log(movie)
    await ctx.render('wechat/movie.jade', params)
}
