
var sha1 = require('sha1')
var getRawBody = require('raw-body')
//通过这个raw-body模块  可以把这个this上的request对象 其实也就是http模块中的request对象去拼接它的数据  最终可以拿到一个buffer的xml数据
var Wechat = require('./wechat')
var util = require('./util')

module.exports = function(opts, reply) {
  var wechat = new Wechat(opts)

  return function *(next){ //验证开发者身份
    console.log(this.query)
    var token = opts.token;
    var signature = this.query.signature;
    var nonce = this.query.nonce;
    var timestamp = this.query.timestamp;
    var echostr = this.query.echostr;

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    console.log(this.method)
    if(this.method === 'GET'){
      if(sha === signature) {
        this.body = echostr + ''
      }else {
        this.body = 'wrong'
      }
    }else if(this.method === 'POST'){
      if(sha !== signature) {
        this.body = 'wrong'
        return false
      }
      var data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      })

      var content = yield util.parseXMLAsync(data)

      var message = util.formatMessage(content.xml)
      //message 为xml转换成的json且格式化后的json
      console.log(message)

      this.weixin = message

      //改变回复信息函数的this指向  即reply.reply函数
      yield reply.call(this, next)
      //改变回复信息函数的this指向  即Wechat.prototype.reply函数
      wechat.reply.call(this)
      
    }

  }
}

