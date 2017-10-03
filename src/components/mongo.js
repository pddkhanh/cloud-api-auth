/**
 * Module dependencies.
 */
const util = require('./util')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
const config = require('config')

// Load the mongoose models
module.exports.loadModels = callback => {
  // Globbing model files
  util.getGlobbedPaths('./src/models/**/*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath)) // eslint-disable-line

    if (callback) callback()
  })
}

// Initialize Mongoose
module.exports.connect = function(cb) {
  mongoose.Promise = global.Promise

  mongoose.connect(config.get('db.uri'), config.get('db.options'), err => {
    // Log Error
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'))
      console.log(err)
      cb(err)
    } else {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.get('db.debug'))

      // Call callback FN
      module.exports.loadModels(cb)
    }
  })
}

module.exports.disconnect = function(cb) {
  mongoose.disconnect(function(err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'))
    cb(err)
  })
}
