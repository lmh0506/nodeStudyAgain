var path = require('path')
var util = require('./libs/util')

var wechat_file = path.join(__dirname,'./config/wechat.txt')

console.log(wechat_file)
//config.wechat  为存储用于验证开发者信息以及获取和保存票据
var config = {
  wechat: {
    appID: 'wx011a00dd3496d15a',
    appSecret: '989aa58758af621fb233dc736a3bad10',
    token: 'linfl',
    getAccessToken: function(){
      return util.readFileAsync(wechat_file,'utf-8')
    },
    saveAccessToken: function(data){
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file,data)
    }
  }
}

module.exports = config
