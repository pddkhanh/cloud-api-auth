process.env.NODE_ENV = 'test'

const chai = require('chai')

const expect = chai.expect
const errorHandler = require('../src/controllers/core/error')

describe('controllers/core/error', () => {
  it('should be able to get message from MongoDB index error', () => {
    const err = new Error()
    err.errmsg =
      'E11000 duplicate key error index: mean-dev.users.$email_1 dup key: { : "test@user.com" }'
    err.code = 11000
    const msg = errorHandler.getErrorMessage(err)
    expect(msg).is.not.empty
  })

  it('should be able to get default message from custom error', () => {
    const err = new Error('Sample')
    expect(errorHandler.getErrorMessage(err)).be.equal('Sample')
  })

  it('should be able to get message from first child error', () => {
    const err = new Error('Sample message')
    const errObj = { errors: [err] }
    expect(errorHandler.getErrorMessage(errObj)).be.equal('Sample message')
  })

  it('has errorCodes', () => {
    expect(errorHandler.errorCodes).is.not.empty
  })
})
