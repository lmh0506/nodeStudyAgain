var wechat = require('../../wechat/g')
var reply = require('../../wx/reply')
var wx = require('../../wx/index')

exports.hear = async function (ctx, next){
  
  this.middle = wechat(wx.wechatOptions.wechat, reply.reply);

  await this.middle(ctx, next)
}
