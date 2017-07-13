var config = require('./config')
var Wechat = require('./wechat/wechat')
var wechatApi = new Wechat(config.wechat)


//reply 为回复信息
exports.reply = function *(next){
  //这里的this已被改变
  var message = this.weixin

  if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      if(message.EventKey){
        console.log('扫二维码进来' + message.EventKey + ' ' + message.Ticket)
      }

      this.body = '哈哈 ， 你订阅了这个公众号    消息ID：'

    }else if(message.Event = 'unsubscribe'){
      console.log('无情取关')
      this.body = ''
    }else if(message.Event = 'LOCATION'){
      this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
    }else if(message.Event === 'CLICK'){
      this.body = '您点击了菜单：' + message.EventKey
    }else if(message.Event === 'SCAN'){
      console.log('关注后扫二维码' + message.EventKey + '  ' + message.Ticket)
      this.body = '看到你扫一下哦'
    }else if(message.Event === 'VIEW'){
      this.body = '你点击了菜单中的链接：' + message.EventKey
    }
  }else if(message.MsgType === 'text'){
    var content = message.Content
    var reply = '额，你说的' + content + '太复杂了'

    if(content === '1'){
      reply = '天下第一'
    }else if(content === '2'){
      reply = '天下第二'
    }else if(content === '3'){
      reply = [{
        title: '技术改变世界',
        description: '只是一个描述',
        picurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/73r1tPDZIkccQu7tplRg9oeq3gTkJM4vJ02icicCEO45trQwAMEkSBcHAQvJVRY4akf7WbTkrfZzUtpAS04HlztA/0',
        url:'https://www.baidu.com/'
      },{
        title: 'nodejs 开发微信',
        description: '6666',
        picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        url:'https://passport.weibo.com/visitor/visitor?entry=miniblog&a=enter&url=http%3A%2F%2Fweibo.com%2F&domain=.weibo.com&sudaref=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DexFJfyBq_Sl5EL4FC91A45Fb01tF1joIQIYUVNO4GrW%26wd%3D%26eqid%3Df6569375000261a30000000459622c34&ua=php-sso_sdk_client-0.6.23&_rand=1499606069.8978'
      }]
    }else if(content === '4'){
      var data = yield wechatApi.uploadMaterial(__dirname + '/2.jpg', 'image')

      reply = {
        type: 'image',
        media_id: data.media_id
      }
    }else if(content === '5'){
      var data = yield wechatApi.uploadMaterial(__dirname + '/1.mp4', 'video')

      reply = {
        type: 'video',
        title: '视频标题',
        description: '视频描述',
        media_id: data.media_id
      }
    }else if(content === '6'){
      var data = yield wechatApi.uploadMaterial(__dirname + '/2.jpg', 'image')

      reply = {
        type: 'music',
        title: '音乐标题',
        description: '音乐描述',
        MUSIC_Url: 'http://sc1.111ttt.com/2017/1/05/09/298092204432.mp3',
        media_id: data.media_id
      }
    }else if(content === '7'){
      var data = yield wechatApi.uploadMaterial(__dirname + '/2.jpg', 'image',{type: 'image'})

      reply = {
        type: 'image',
        media_id: data.media_id
      }
    }else if(content === '8'){
      var data = yield wechatApi.uploadMaterial(__dirname + '/1.mp4', 'video',{type: 'vide', description: '{"title":"视频标题", "introduction": "视频描述"}'})

      reply = {
        type: 'video',
        title: '视频标题',
        description: '视频描述',
        media_id: data.media_id
      }
    }else if(content === '9'){
      var picData = yield wechatApi.uploadMaterial(__dirname + '/2.jpg', 'image', {})

      var media = {
        articles: [{
          title: 'tututu',
          thumb_media_id: picData.media_id,
          author: 'lmh',
          digest: '没有摘要',
          show_cover_pic: 1,
          content: '没有内容',
          content_source_url: 'https://www.baidu.com/'
        }]
      }

      data = yield wechatApi.uploadMaterial(media , 'news' , {})
      data = yield wechatApi.fetchMaterial(data.media_id, 'news', {})

      console.log(data)
      var items = data.news_item
      var news = []

      items.forEach(function(item){
        news.push({
          title: item.title,
          description: item.digest,
          picurl: picData.url,
          url: item.url
        })
      })

      reply = news
    }else if(content === '10'){
      var counts = yield wechatApi.countMaterial()
      console.log(JSON.stringify(counts))
      var list = yield wechatApi.batchMaterial({
        type:'image',
        offset:0,
        count:10
      })
      var list1 = yield wechatApi.batchMaterial({
        type:'video',
        offset:0,
        count:10
      })
      var list2 = yield wechatApi.batchMaterial({
        type:'voice',
        offset:0,
        count:10
      })
      var list3 = yield wechatApi.batchMaterial({
        type:'news',
        offset:0,
        count:10
      })
      console.log(list,list1,list2,list3)
    }else if(content === '11'){
      // var tag = yield wechatApi.createTags('hgh')
      // console.log('公众号新标签 newwechat')
      // console.log(tag)

      // var tags = yield wechatApi.fetchTags()
      // console.log('加了newwechat后的 公众号标签列表')
      // console.log(tags)

      // var userList = yield wechatApi.fetchTagsUserList(100)
      // console.log('wechat标签下的粉丝列表')
      // console.log(userList)

      // var tagList = yield wechatApi.checkTags(message.FromUserName)
      // console.log('wechat标签下的第一个粉丝的身上的标签列表')
      // console.log(tagList)

      // var tag2 = yield wechatApi.createTags('lmh')
      // console.log('公众号第二个标签 lmh')
      // console.log(tag2)

      // yield wechatApi.batchToggleTags([message.FromUserName], 100, false)
      // console.log('批量取消wechat标签')
      // yield wechatApi.batchToggleTags([message.FromUserName], 101, true)
      // console.log('批量打上lmh标签')

      // yield wechatApi.updateTags(102, 'fl')
      // console.log('修改成功')
      // yield wechatApi.deleteTags(103)
      // console.log('删除成功')
      reply = 'tags'
    }else if(content === '12'){
      var user = yield wechatApi.fetchUsers(message.FromUserName)
      console.log(user)

      var openids = [{
        openid: message.FromUserName,
        lang: 'zh_CN'
      }]
      var users = yield wechatApi.fetchUsers(openids)
      console.log(users)

      reply = JSON.stringify(user)
    }else if(content === '13'){
      var userList = yield wechatApi.listUsers()
      console.log(userList)

      reply = JSON.stringify(userList)
    }

    this.body = reply
  }
}