const mongoose = require('mongoose')

mongoose.set('debug', true)
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/game')

module.exports.User = require('./user')
module.exports.Game = require('./game')
module.exports.Request = require('./request')