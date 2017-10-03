/**
 * Module dependencies
 */
const passport = require('passport')
const path = require('path')

const User = require('../../models/user')
const util = require('./../util')

/**
* Module init function
*/
module.exports.config = function(app) {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user._id)
  })

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne(
      {
        _id: id,
      },
      '-salt -password',
      function(err, user) {
        done(err, user)
      },
    )
  })

  // Initialize strategies
  util
    .getGlobbedPaths(path.resolve(__dirname, './strategies/**/*.js'))
    .forEach(function(strategy) {
      require(path.resolve(strategy))()
    })

  // Add passport's middleware
  app.use(passport.initialize())
}

module.exports.authenticate = function() {
  return passport.authenticate('jwt', { session: false })
}
