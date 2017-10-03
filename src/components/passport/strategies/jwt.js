const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')
const config = require('config')

const User = require('../../../models/user')

module.exports = function() {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = config.get('jwt.secret')
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      User.findById(jwt_payload.userId, function(err, user) {
        if (err) {
          return done(err, false)
        }
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    }),
  )
}
