process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const mongo = require('../src/components/mongo')
const server = require('../src/app')

const expect = chai.expect
chai.use(chaiHttp)

const User = require('./../src/models/user')

const credentials = {
  email: 'user@test.com',
  password: 'password',
}

describe('routes /twilio', () => {
  before(done => {
    mongo.connect(() => {
      done()
    })
  })

  beforeEach(done => {
    chai
      .request(server)
      .post('/api/auth/register')
      .send(credentials)
      .end((err, res) => {
        expect(err).not.exist
        done()
      })
  })

  describe('POST /token', () => {
    describe('when authenticated', () => {
      let accessToken = ''
      beforeEach(done => {
        chai
          .request(server)
          .post('/api/auth/login')
          .send(credentials)
          .end((err, res) => {
            expect(err).not.exist
            expect(res.body.access_token).is.not.empty
            accessToken = res.body.access_token
            done()
          })
      })

      it('should be able to get twilio token', done => {
        chai
          .request(server)
          .post('/api/twilio/token')
          .set('Authorization', 'Bearer ' + accessToken)
          .send({ deviceId: 'deviceId' })
          .end((err, res) => {
            expect(err).not.exist
            expect(res).to.have.status(200)
            expect(res.body.twilioToken).is.not.empty
            done()
          })
      })

      it('should got 400 when send empty body', done => {
        chai
          .request(server)
          .post('/api/twilio/token')
          .set('Authorization', 'Bearer ' + accessToken)
          .send({})
          .end((err, res) => {
            expect(res).to.have.status(400)
            done()
          })
      })
    })

    describe('when unauthenticated', () => {
      it('shoudl got 401 error', done => {
        chai
          .request(server)
          .post('/api/twilio/token')
          .send({ deviceId: 'deviceId' })
          .end((err, res) => {
            expect(res).to.have.status(401)
            done()
          })
      })
    })
  })

  afterEach(done => {
    User.remove().exec(done)
  })
})
