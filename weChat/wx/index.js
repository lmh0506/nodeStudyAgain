var path = require('path')
var util = require('../libs/util')
var Wechat = require('../wechat/wechat')
var wechat_file = path.join(__dirname,'../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname,'../config/wechat_ticket.txt')

console.log(wechat_file)
//config.wechat  为存储用于验证开发者信息以及获取和保存票据
var config = {
  wechat: {
    appID: 'wx011a00dd3496d15a',
    appSecret: '989aa58758af621fb233dc736a3bad10',
    token: 'linfl',
    getAccessToken: function(){
      return util.readFileAsync(wechat_file, 'utf-8')
    },
    saveAccessToken: function(data){
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    },
    getTicket: function(){
      return util.readFileAsync(wechat_ticket_file,'utf-8')
    },
    saveTicket: function(data){
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_ticket_file, data)
    }
  }
}

exports.wechatOptions = config

exports.getWechat = function(){
  var wechatApi = new Wechat(config.wechat)

  return wechatApi
}