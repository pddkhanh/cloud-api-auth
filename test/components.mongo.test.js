process.env.NODE_ENV = 'test'
const expect = require('chai').expect

const mongo = require('../src/components/mongo')

describe('components/mongo', () => {
  it('should connect and disconnect successfully', () => {
    mongo.connect(err => {
      expect(err).not.exist
      mongo.disconnect(err2 => {
        expect(err2).not.exist
        done()
      })
    })
  })
})
