const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const shortid = require('shortid')
const _ = require('lodash')

const Schema = mongoose.Schema

/**
* A Validation function for local strategy email
*/
const validateLocalStrategyEmail = function(email) {
  return (
    (this.provider !== 'local' && !this.updated) ||
    validator.isEmail(email, { require_tld: false })
  )
}

/**
* User Schema
*/
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Email address is invalid'],
  },
  password: {
    type: String,
    default: '',
  },
  twilioIdentity: {
    type: String,
  },
  salt: {
    type: String,
  },
  profileImageURL: {
    type: String,
    default: 'images/profile/default.png',
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerData: {},
  additionalProvidersData: {},
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
})

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true },
    },
  },
)

UserSchema.index(
  { twilioIdentity: 1 },
  {
    unique: true,
    partialFilterExpression: {
      twilioIdentity: { $exists: true },
    },
  },
)

/**
* Hook a pre save method to hash the password
*/
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64')
    this.password = this.hashPassword(this.password)
  }

  if (_.isEmpty(this.twilioIdentity)) {
    this.constructor.findUniqueTwilioIdentity(identity => {
      this.twilioIdentity = identity
      next()
    })
  } else {
    next()
  }
})

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function(next) {
  if (
    this.provider === 'local' &&
    // this.password &&
    this.isModified('password')
  ) {
    if (this.password.length === 0) {
      this.invalidate('password', 'Password is required')
    }
  }

  next()
})

/**
* Create instance method for hashing a password
*/
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto
      .pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1')
      .toString('base64')
  }
  return password
}

/**
* Create instance method for authenticating user
*/
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password)
}

/**
 * Find unique twilioIdentity
 */
UserSchema.statics.findUniqueTwilioIdentity = function(callback) {
  const _this = this
  const identity = shortid.generate().replace(/\-/g, '_')

  _this.findOne(
    {
      twilioIdentity: identity,
    },
    function(err, user) {
      if (!err) {
        if (!user) {
          callback(identity)
        } else {
          return _this.findUniqueTwilioIdentity(callback)
        }
      } else {
        callback(null)
      }
    },
  )
}

module.exports = mongoose.model('User', UserSchema)
