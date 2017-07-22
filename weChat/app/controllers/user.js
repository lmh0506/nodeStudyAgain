var mongoose = require('mongoose')
var User = mongoose.model('User')

// signup
exports.showSignup = async function(ctx, next) {
  await ctx.render('pages/signup.jade', {
    title: '注册页面'
  })
}

exports.showSignin = async function(ctx, next) {
  await ctx.render('pages/signin.jade', {
    title: '登录页面'
  })
}

exports.signup = async function(ctx, next) {
  var _user = ctx.request.body.user

  user = await User.findOne({name: _user.name}).exec()

    if (user) {
      ctx.response.redirect('/signin')
    }
    else {
      user = new User(_user)
      await user.save()
      ctx.session.user = user
      ctx.response.redirect('/')
    }
}

// signin
exports.signin = async function(ctx, next) {
  var _user = ctx.request.body.user
  var name = _user.name
  var password = _user.password

  user = await User.findOne({name: name}).exec()

    if (!user) {
      ctx.response.redirect('/signup')
    }

  isMatch = await user.comparePassword(password, user.password)
    if (isMatch) {
      ctx.session.user = user

      ctx.response.redirect('/')
    }
    else {
      ctx.response.redirect('/signin')
    }
}

// logout
exports.logout =  async function(ctx, next) {
  delete ctx.session.user
  //delete app.locals.user

  ctx.response.redirect('/')
}

// userlist page
exports.list = async function(ctx, next) {
  var users = await User
    .find({})
    .sort('meta.updateAt')
    .exec(cb)

    await ctx.render('pages/userlist.jade', {
      title: 'imooc 用户列表页',
      users: users
    })
}

// midware for user
exports.signinRequired = async function(ctx, next) {
  var user = ctx.session.user

  if (!user) {
    ctx.response.redirect('/signin')
  }else{
    await next()
  }
}

exports.adminRequired = async function(ctx, next) {
  var user = ctx.session.user

  if (user.role <= 10) {
    ctx.response.redirect('/signin')
  }else{
    await next()
  }

}