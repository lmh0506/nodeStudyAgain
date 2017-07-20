var fs = require('fs')
var Promise = require('bluebird')
//读取票据
exports.readFileAsync = function(fpath, encodning){
  return new Promise(function(resolve, reject){
    fs.readFile(fpath, encodning, function(err, content){
      if(err) reject(err)
      else {
        console.log('读取成功')
        resolve(content)
      }
    })
  })
}
//写入票据
exports.writeFileAsync = function(fpath, content){
  return new Promise(function(resolve, reject){
    fs.writeFile(fpath, content, function(err, content){
      if(err) reject(err)
      else{
        console.log('写入成功')
        resolve()
      } 
    })
  })
}

var crypto = require('crypto')

var createNonce = function(){//生成随机字符串
  return Math.random().toString(36).substr(2,15)
}

var createTimestamp = function(){//生成时间戳
  return parseInt(new Date().getTime() / 1000, 10) + ''
}

//签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。即signature=sha1(string1)
function _sign(nonceStr, ticket, timestamp, url){
  var params = [
    'noncestr=' + nonceStr,
    'jsapi_ticket=' + ticket,
    'timestamp=' + timestamp,
    'url=' + url
  ]

  var str = params.sort().join('&')
  console.log(str)
  var shasum = crypto.createHash('sha1')

  shasum.update(str)

  return shasum.digest('hex')
}

exports.sign = function(ticket, url){//生成签名
  var nonceStr = createNonce()
  var timestamp = createTimestamp()
  var signature = _sign(nonceStr, ticket, timestamp, url)

  return {
    nonceStr: nonceStr,
    timestamp: timestamp,
    signature: signature
  }
}