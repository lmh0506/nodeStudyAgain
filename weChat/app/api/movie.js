var mongoose = require('mongoose')
var co = require('co')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var _lodash = require('lodash')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')


// index page
exports.findAll = async function() {
  var categories = await Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster',
      options: { limit: 6 }
    })
    .exec()

    return categories
}

exports.searchByCategory = async function(catId){
  var categories = await Category
    .find({_id: catId})
    .populate({
      path: 'movies',
      select: 'title poster'
    })
    .exec()

    return categories
}

exports.searchByName = async function(name){
  var movies = await Movie
    .find({title: new RegExp(name + '.*', 'i')})
    .exec()

    return movies
}

function updateMovies(movie){
  var options = {
    url: 'http://api.douban.com/v2/movie/subject/' + movie.doubanId,
    json: true
  }
  console.log(movie)
  request(options).then((res) => {
    var data = res.body

    _lodash.extend(movie, {
      country: data.countries[0],
      language: data.language,
      summary: data.summary
    })

    var genres = movie.genres
    var cateArr = []
    if(genres && genres.length > 0){
      genres.forEach((genre) => {
        cateArr.push(async () => {
          var cate = await Category.findOne({name: genre}).exec()

          if(cate){
            cate.movies.push(movie._id)
            await cate.save()
          }else{
            cate = new Category({
              name: genre,
              movies: [movie._id]
            })

            cate = await cate.save()

            movie.category = cate._id
            await movie.save()
          }
        })
      })

      co(async ()=> {
        cateArr.forEach(async (item) => {
          await item()
        })

      })
    }else{
      movie.save()
    }
  })
}

exports.searchByDouban = async function (name){
  var options = {
    url: 'http://api.douban.com/v2/movie/search?q=',
    json: true
  }
  options.url += encodeURIComponent(name)

  var response = await request(options)

  var data = response.body;
  
  var subjects = []
  var movies = []

  if(data && data.subjects){
    subjects = data.subjects
  }

  if(subjects.length > 0){
    var queryArr = []
    subjects.forEach((item) => {
      queryArr.push(async ()=> {
        var movie = await Movie.findOne({doubanId: item.id})
        
        if(movie){
          movies.push(movie)
        }else{
          var directors = item.directors || []
          var director = directors[0] || {}

          movie = new Movie({
            directors: director.name || '',
            title: item.title,
            doubanId: item.id,
            poster: item.images.large,
            year: item.year,
            genres: item.genres || []
          })

          movie = await movie.save()
          movies.push(movie)
        }
      })
    })
     queryArr.forEach(async (item) => {
      await item()
    })

    movies.forEach((movie) => {
      updateMovies(movie)
    })

  }

  return movies
  
}

exports.searchById = async function(id){
  var movie = await Movie
    .findOne({_id: id})
    .exec()
  
  return movie
}
