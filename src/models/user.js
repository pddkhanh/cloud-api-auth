const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')

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
    index: {
      unique: true,
      sparse: true,
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Email address is invalid'],
  },
  password: {
    type: String,
    default: '',
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

/**
* Hook a pre save method to hash the password
*/
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64')
    this.password = this.hashPassword(this.password)
  }

  next()
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

module.exports = mongoose.model('User', UserSchema)
