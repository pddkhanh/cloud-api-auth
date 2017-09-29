process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const mongo = require('../src/components/mongo')
const server = require('../src/app')

const should = chai.should()
chai.use(chaiHttp)

describe('routes.index', () => {
  before(done => {
    mongo.connect(() => {
      done()
    })
  })

  describe('GET /', () => {
    it('should respone 200', done => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
