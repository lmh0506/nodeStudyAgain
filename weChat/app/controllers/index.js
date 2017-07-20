var Movie = require('../api/movie')

// index page
exports.index = async function(ctx, next) {
  var categirues = await Movie.findAll()

  await ctx.render('page/index', {
    title: 'imooc 首页',
    categories: categories
  })
}

// search page
exports.search = async function(ctx, next) {
  var catId = ctx.query.cat
  var q = ctx.query.q
  var page = parseInt(ctx.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {
    var categories = await Movie.searchByCategory(catId)
    var category = categories[0] || {}
    var movies = category.movies || []
    var results = movies.slice(index, index + count)

    await ctx.render('page/results', {
      title: 'imooc 结果列表页面',
      keyword: category.name,
      currentPage: (page + 1),
      query: 'cat=' + catId,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  }
  else {
    var movies = await Movie.searchByName(q)
    var results = movies.slice(index, index + count)

    await ctx.render('page/results', {
      title: 'imooc 结果列表页面',
      keyword: q,
      currentPage: (page + 1),
      query: 'q=' + q,
      totalPage: Math.ceil(movies.length / count),
      movies: results
    })
  }
}