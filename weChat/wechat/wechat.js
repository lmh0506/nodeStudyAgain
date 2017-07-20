var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var _ = require('lodash')
var util = require('./util')
var fs = require('fs')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'; //请求地址前缀

var api = {
  semanticUrl: 'https://api.weixin.qq.com/semantic/semproxy/search?',//语义理解请求地址
  accessToken: prefix + 'token?grant_type=client_credential' ,//获取票据的url
  temporary: {//临时素材的url
    upload: prefix + 'media/upload?',//新增
    fetch: prefix + 'media/get?'//获取临时素材的url
  },
  permanent: {//永久素材的url
    upload: prefix + 'material/add_material?',
    uploadNews: prefix + 'material/add_news?',
    uploadNewsPic: prefix + 'media/uploadimg?',
    fetch: prefix + 'material/get_material?',//获取永久素材url
    del: prefix + 'material/del_material',//删除永久素材url
    update: prefix + 'material/update_news?',//更新永久素材url
    count: prefix + 'material/get_materialcount?',//获取永久素材总数
    batch: prefix + 'material/batchget_material?'//获取永久素材列表
  },
  tags: {//标签
    create: prefix +  'tags/create?',//创建标签的url
    fetch: prefix +  'tags/get?',//获取公众号已创建的标签的url
    update: prefix +  'tags/update?',//编辑标签的url
    delete: prefix +  'tags/delete?',//删除标签的url
    check: prefix + 'tags/getidlist?',//获取用户身上的标签列表的url
    batchUnTag: prefix + 'tags/members/batchuntagging?',//批量为用户取消标签的url
    batchTag: prefix + 'tags/members/batchtagging?',//批量为用户打标签的url
    getUserList: prefix + 'user/tag/get?'// 获取标签下粉丝列表
  },
  user: {
    remark: prefix + 'user/info/updateremark?',//设置用户备注名的url
    fetch: prefix + 'user/info?',//获取用户信息的url
    batchFetch: prefix + 'user/info/batchget?',//批量获取用户信息的url
    list: prefix + 'user/get?',//获取用户列表
  },
  mass: {
    tags: prefix + 'message/mass/sendall?', //根据标签进行群发
    openId: prefix + 'message/mass/send?',//根据OpenID列表群发
    del : prefix + 'message/mass/delete?',//删除群发
    preview: prefix + 'message/mass/preview?',//预览接口
    check: prefix + 'message/mass/get?'//查询群发消息发送状态
  },
  menu: {
    create: prefix + 'menu/create?',//自定义菜单创建
    get : prefix + 'menu/get?',//自定义菜单查询
    del: prefix + 'menu/delete?',//自定义菜单删除
    current: prefix + 'get_current_selfmenu_info?'//获取自定义菜单配置
  },
  ticket: {
    get : prefix + 'ticket/getticket?'//用access_token 采用http GET方式请求获得jsapi_ticket
  }
}

//wechat对象用于获取票据信息  并判断票据是否过期是否合法
const Wechat = function (opts){
  this.appID = opts.appID;
  this.appSecret = opts.appSecret;

  this.getAccessToken = opts.getAccessToken;
  this.saveAccessToken = opts.saveAccessToken;

  this.getTicket = opts.getTicket;
  this.saveTicket = opts.saveTicket;

  this.fetchAccessToken()

}

//获取access_token
Wechat.prototype.fetchAccessToken = function(){
  var that = this

  //不存在就重新获取票据
  return this.getAccessToken() // 获取票据
    .then(function(data){
      try{
        data = JSON.parse(data)
      }
      catch(e){
        return that.updateAccessToken()
      }

      if(that.isValidAccessToken(data)){ //判断票据是否在有效期内
        return Promise.resolve(data) //如果合法 将data传递下去
      }else{ //不合法就更新票据
        return that.updateAccessToken()
      }
    })
    .then(function(data){

      that.saveAccessToken(data)
      return Promise.resolve(data)
    })
}

Wechat.prototype.isValidAccessToken = function(data){//判断票据是否有效
  //如果data对象不存在 票据也不存在  有效期字段也不存在就返回false
  if(!data || !data.access_token || !data.expires_in){
    return false
  }
  var access_token = data.access_token;
  var expires_in = data.expires_in;
  var now = (new Date().getTime())

  if(now < expires_in){ //判断当前时间是否在有效期内
    return true
  }else{
    return false
  }
}

//更新access_token票据
Wechat.prototype.updateAccessToken = function(){
  var appID = this.appID;
  var appSecret = this.appSecret;
  var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;//请求票据的地址

  return new Promise(function(resolve, reject){
    //请求票据 返回的值要求为json
    request({url: url, json: true}).then(function(res){
      var data = res.body; 
      console.log(res.body)
      var now = (new Date().getTime());
      var expires_in = now + (data.expires_in - 20) * 1000;//提前20秒更新票据
    //更新有效时间
      data.expires_in = expires_in

      resolve(data) //传递data
    })
  })
  
}

//获取jsapi_ticket
Wechat.prototype.fetchTicket = function(access_token){
  var that = this

  //不存在就重新获取票据
  return this.getTicket() // 获取jsapi_ticket票据
    .then(function(data){
      try{
        data = JSON.parse(data)
      }
      catch(e){
        return that.updateTicket(access_token)
      }

      if(that.isValidTicket(data)){ //判断jsapi_ticket票据是否在有效期内
        return Promise.resolve(data) //如果合法 将data传递下去
      }else{ //不合法就更新票据
        return that.updateTicket(access_token)
      }
    })
    .then(function(data){

      that.saveTicket(data)
      return Promise.resolve(data)
    })
}

//更新jsapi_ticket票据
Wechat.prototype.updateTicket = function(access_token){
  var url = api.ticket.get + 'access_token=' + access_token + '&type=jsapi';//请求jsapi_ticket票据的地址

  return new Promise(function(resolve, reject){
    //请求票据 返回的值要求为json
    request({url: url, json: true}).then(function(res){
      var data = res.body; 
      console.log(res.body)
      var now = (new Date().getTime());
      var expires_in = now + (data.expires_in - 20) * 1000;//提前20秒更新票据
    //更新有效时间
      data.expires_in = expires_in

      resolve(data) //传递data
    })
  })
  
}

Wechat.prototype.isValidTicket = function(data){//判断票据是否有效
  //如果data对象不存在 票据也不存在  有效期字段也不存在就返回false
  if(!data || !data.ticket || !data.expires_in){
    return false
  }
  var ticket = data.ticket;
  var expires_in = data.expires_in;
  var now = (new Date().getTime())

  if(ticket && now < expires_in){ //判断当前时间是否在有效期内
    return true
  }else{
    return false
  }
}

//回复信息
Wechat.prototype.reply = function(){
  //这里的this已被改变
  var content = this.body
  var message = this.weixin

  //将回复信息转成xml格式
  var xml = util.tpl(content, message)
  console.log(xml)
  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}

//上传素材
Wechat.prototype.uploadMaterial = function(material, type, permanent){
  var form = {}
  //默认为临时素材上传地址
  var uploadUrl = api.temporary.upload
  if(permanent){//permanent存在则 上传地址改为永久素材
    uploadUrl = api.permanent.upload

    _.extend(form, permanent)
  }

  if(type === 'pic'){//如果type为pic  则地址改为图文消息的图片上传地址
    uploadUrl = api.permanent.uploadNewsPic
  }

  if(type === 'news'){//如果type为news 即图文素材 
    uploadUrl = api.permanent.uploadNews
    //如果为图文时 material 就是图文的数据
    form = material
  }else{//如果不为图文时 material为图片路径
    form.media = fs.createReadStream(material)
  }

  var that = this
  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = uploadUrl + 'access_token=' + data.access_token;

        if(!permanent){//如果为临时素材 则地址需在拼接上type
          url += '&type=' + type
        }else{
          form.access_token = data.access_token
        }

        //上传的参数
        var options = {
          method: 'POST',
          url: url,
          json: true
        }

        
        if(type === 'news'){//如果上传的为图文时  则把form赋值给options.body
          options.body = form
        }else{
          options.formData = form
        }

        request(options)
          .then((res) => {
            let _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('上传素材失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取永久素材url
Wechat.prototype.fetchMaterial = function(mediaId, type, permanent){
  var that = this;
  var form = {}
  var fetchUrl = api.temporary.fetch

  if(permanent){
    fetchUrl = api.permanent.fetch
  }

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = fetchUrl + 'access_token=' + data.access_token

        var options = {method: 'POST', url: url, json: true}
        var form = {}

        if(permanent){
          form.media_id = mediaId
          form.access_token = data.access_token
          options.body = form
        }else{
          if(type === 'video'){//如果获取的是永久素材  且类型为视频
            //将url的https协议改为http
            url = url.replace('https://', 'http://')
          }

          url += '&media_id=' + mediaId
        }

        if(type === 'news' || type === 'video'){
          request(options)
            .then((res) => {
              var _data = res.body
              if(_data){
                resolve(_data)
              }else{
                throw new Error('获取素材失败')
              }
            })
            .catch((err) => {
              reject(err)
            })
        }else{
          resolve(url)//传递获取素材的链接
        }
      })
  })
}

//删除永久素材
Wechat.prototype.deleteMaterial = function(mediaId){
  var that = this;
  var form = {
    media_id: mediaId
  }

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.permanent.del + 'access_token=' + data.access_token + '&media_id=' + mediaId

        request({method: 'POST',url: url, body: form, json: true})
          .then((res) => {
            var _data = res.body
            if(_data){
              resolve(_data)
            }else{
              throw new Error('删除素材失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//修改永久素材
Wechat.prototype.updateMaterial = function(mediaId, news){
  var that = this
  var form = {
    media_id: mediaId
  }

  _.extend(form, news)

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.permanent.update + 'access_token=' + data.access_token + '&media_id=' + mediaId

        request({method: 'POST',url : url, body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('修改素材失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取永久素材总数
Wechat.prototype.countMaterial = function(){
  var that = this

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.permanent.count + 'access_token=' + data.access_token

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取素材总数失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取永久素材列表
Wechat.prototype.batchMaterial = function(options){
  var that = this

  options.type = options.type || 'image'
  options.offset = options.offset || 0
  options.count = options.count || 1

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.permanent.batch + 'access_token=' + data.access_token

        request({method: 'POST',url : url, body: options, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取素材列表失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//为公众号创建标签
Wechat.prototype.createTags = function(name){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.create + 'access_token=' + data.access_token
        var form = {
          tag: {
            name: name
          }
        }
        request({method: 'POST',url : url, body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('创建标签失败失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取公众号已创建的标签
Wechat.prototype.fetchTags = function(){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.fetch + 'access_token=' + data.access_token

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('创建标签失败失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取标签下粉丝列表
Wechat.prototype.fetchTagsUserList = function(tagid, next_openid){//"next_openid":""//第一个拉取的OPENID，不填默认从头开始拉取
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.getUserList + 'access_token=' + data.access_token

        var form = {
          tagid: tagid
        }
        if(next_openid){
          form.next_openid = next_openid
        }

        request({method: 'POST',url : url,body : form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取标签下粉丝列表失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

// 获取用户身上的标签列表
Wechat.prototype.checkTags = function(openid){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.check + 'access_token=' + data.access_token

        var form = {
          openid: openid
        }

        request({method: 'POST',url : url,body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取用户身上的标签列表失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//编辑公众号标签
Wechat.prototype.updateTags = function(id, name){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.update + 'access_token=' + data.access_token

        var form = {
          tag: {
            id: id,
            name: name
          }
        }

        request({method: 'POST',url : url,body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('编辑标签失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//批量为用户取消或打标签
Wechat.prototype.batchToggleTags = function(openid_list, tagid, flag){
  var that = this;
  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        //flag为真就批量打标签 否则取消标签
        let toggleUrl = flag ? api.tags.batchTag : api.tags.batchUnTag

        let url = toggleUrl + 'access_token=' + data.access_token

        var form = {
          openid_list: openid_list,
          tagid: tagid
        }

        request({method: 'POST',url : url, body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('批量操作用户标签失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//删除公众号标签
Wechat.prototype.deleteTags = function(id){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.tags.delete + 'access_token=' + data.access_token

        var form = {
          tag: {
            id: id
          }
        }

        request({method: 'POST',url : url,body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('删除标签失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//设置用户备注名
Wechat.prototype.remarkUser = function(openid, remark){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.user.remark + 'access_token=' + data.access_token

        var form = {
          openid: openid,
          remark: remark
        }

        request({method: 'POST',url : url, body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('设置用户备注名失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//批量或单个获取用户信息
Wechat.prototype.fetchUsers = function(openids, lang){
  var that = this;
  lang = lang || 'zh_CN'
  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        var url;
        var options = {
          json: true
        }

        if(_.isArray(openids)){//如果openids为数组则为批量获取
          options.url = api.user.batchFetch + 'access_token=' + data.access_token
          options.body = {
            user_list: openids
          }
          options.method = 'POST'
        }else{
          options.url = api.user.fetch + 'access_token=' + data.access_token + '&openid=' + openids + '&lang=' + lang
          options.method = 'GET'
        }

        request(options)
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('批量或单个获取用户信息失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取用户列表
Wechat.prototype.listUsers = function(openid){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.user.list + 'access_token=' + data.access_token 
        if(openid){
          url += '&next_openid=' + openid
        }

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取用户列表失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//根据标签进行群发
Wechat.prototype.sendByTag = function(type, message, tagid){
  var that = this;

  var msg = {
    filter: {},
    msgtype: type
  }

  msg[type] = message

  if(!tagid){
    msg.filter.is_to_all = true
  }else{
    msg.filter = {
      is_to_all : false,
      tag_id : tagid
    }
  }

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.mass.tags + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: msg, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('根据标签进行群发失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//根据OpenID列表群发
Wechat.prototype.sendByOpenId = function(type, message, openids){
  var that = this;

  var msg = {
    msgtype: type,
    touser: openids
  }

  msg[type] = message

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.mass.openId + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: msg, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('根据OpenID列表群发失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//删除群发
Wechat.prototype.deleteMass = function(msgId){
  var that = this;

  var form = {
    msg_id: msgId
  }


  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.mass.del + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('删除群发失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//预览
Wechat.prototype.previewMass = function(type, message, openid){
  var that = this;

  var msg = {
    msgtype: type,
    touser: openid
  }

  msg[type] = message

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.mass.preview + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: msg, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('预览失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//查询群发消息发送状态
Wechat.prototype.checckMass = function(msgId){
  var that = this;

  var msg = {
    msg_id: msgId
  }

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.mass.check + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: msg, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('查询群发消息发送状态失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//自定义菜单创建
Wechat.prototype.createMenu = function(menu){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.menu.create + 'access_token=' + data.access_token 

        request({method: 'POST',url : url,body: menu, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('自定义菜单创建失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//自定义菜单查询
Wechat.prototype.getMenu = function(){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.menu.get + 'access_token=' + data.access_token 

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('自定义菜单查询失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//自定义菜单删除
Wechat.prototype.deleteMenu = function(){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.menu.del + 'access_token=' + data.access_token 

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('自定义菜单删除失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//获取自定义菜单配置
Wechat.prototype.getCurrentMenu = function(){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.menu.current + 'access_token=' + data.access_token 

        request({method: 'GET',url : url, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('获取自定义菜单配置失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

//语义理解
Wechat.prototype.semantic = function(form){
  var that = this;

  return new Promise(function(resolve, reject){
    that.fetchAccessToken()
      .then(function(data){
        let url = api.semanticUrl + 'access_token=' + data.access_token 
        form.appid = data.appID

        request({method: 'POST',url : url,body: form, json: true})
          .then((res) => {
            var _data = res.body

            if(_data){
              resolve(_data)
            }else{
              throw new Error('语义理解请求发送失败')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

module.exports = Wechat