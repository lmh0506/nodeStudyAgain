var xml2js = require('xml2js')
var Promise = require('bluebird')
var tpl = require('./template')

exports.parseXMLAsync = function(xml){ //将xml转换成json格式
  return new Promise(function(resolve, reject){
    xml2js.parseString(xml, {trim: true}, function(err, content){
      if(err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage(result){//格式化json
  var message = {}
  //如果需要被格式化的值为对象  则去遍历他
  if(typeof result === 'object'){ //typeof会返回一个变量的基本类型
    for(let key in result){
      let item = result[key]
      
      //如果不为数组或长度为0跳过本次遍历
      if(!(item instanceof Array) || item.length === 0){//instanceof 返回的是一个bool值  只能用来判断对象和函数  不能用来判断数字和字符串
        continue;
      }


      if(item.length === 1){
        let val = item[0];
        //如果为对象则继续遍历其子元素
        if(typeof val === 'object'){
          message[key] = formatMessage(val)
        }else {
          //如果不是则将他的值赋值给message
          message[key] = (val || '').trim()
        }
      }else{
        message[key] = []

        for(var j = 0 ,k = item.length; j < k; j++){
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }

  return message
}

exports.formatMessage = formatMessage

exports.tpl = function(content, message){
  var info = {}
  var type = 'text'
  var fromUserName = message.FromUserName
  var toUserName = message.ToUserName

  if(Array.isArray(content)){
    type = 'news'
  }

  type = content.type || type
  info.content = content
  info.createTime = new Date().getTime()
  info.msgType = type
  info.toUserName = fromUserName
  info.fromUserName = toUserName

  return tpl.complied(info)

}
