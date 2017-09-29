process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const mongo = require('../src/components/mongo')
const User = require('../src/models/user')

describe('User model', () => {
  before(done => {
    mongo.connect(() => {
      done()
    })
  })

  it('should start with empty data', done => {
    User.find({}, (err, rs) => {
      expect(rs).be.empty
      done()
    })
  })
})
