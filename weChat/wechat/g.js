
var sha1 = require('sha1')
var getRawBody = require('raw-body')
//通过这个raw-body模块  可以把这个this上的request对象 其实也就是http模块中的request对象去拼接它的数据  最终可以拿到一个buffer的xml数据
var Wechat = require('./wechat')
var util = require('./util')

module.exports = function(opts, reply) {
  var wechat = new Wechat(opts)

  return async function (ctx, next){ //验证开发者身份
    console.log(ctx.query)
    var token = opts.token;
    var signature = ctx.query.signature;
    var nonce = ctx.query.nonce;
    var timestamp = ctx.query.timestamp;
    var echostr = ctx.query.echostr;

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    console.log(ctx.method)
    if(ctx.method === 'GET'){
      if(sha === signature) {
        ctx.body = echostr + ''
      }else {
        ctx.body = 'wrong'
      }
    }else if(ctx.method === 'POST'){
      if(sha !== signature) {
        ctx.body = 'wrong'
        return false
      }
      var data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })

      var content = await util.parseXMLAsync(data)

      var message = util.formatMessage(content.xml)
      //message 为xml转换成的json且格式化后的json
      console.log(message)

      this.weixin = message

      //改变回复信息函数的this指向  即reply.reply函数
      await reply.call(this, next)

      //改变回复信息函数的this指向  即Wechat.prototype.reply函数
      wechat.reply.call(this)

      ctx.response.status = this.status
      ctx.response.type = this.type
      ctx.response.body = this.body
    }

  }
}

