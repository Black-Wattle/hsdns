const path = require('path')
const homedir = require('os').homedir()
const flatCache = require('flat-cache')
const cache = flatCache.load('config', path.resolve(homedir + '/.hsdns'))

const set = (path, obj) => {
  cache.setKey(path, obj)
  cache.save()
  return
}

const get = path => {
  return cache.getKey(path)
}

module.exports = { set, get }
