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