var mongoose = require('mongoose')
var Category = mongoose.model('Category')

// admin new page
exports.new = async function(ctx, next) {
  await ctx.render('pages/category_admin.jade', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
}

// admin post movie
exports.save = async function(ctx, next) {
  var _category = ctx.request.body.category
  var category = new Category(_category)

  await category.save()

  ctx.redirect('/admin/category/list')
}

// catelist page
exports.list = async function(ctx, next) {
  var catetories = await Category.find({}).exec()

  await ctx.render('pages/categorylist.jade', {
    title: 'imooc 分类列表页',
    catetories: catetories
  })
}