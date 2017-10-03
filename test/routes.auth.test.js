process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const mongo = require('../src/components/mongo')
const server = require('../src/app')

const expect = chai.expect
chai.use(chaiHttp)

const User = require('./../src/models/user')

describe('routes /auth', () => {
  before(done => {
    mongo.connect(() => {
      done()
    })
  })

  describe('POST /register', () => {
    it('should respone 201 with valid info', done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/register')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(201)
          done()
        })
    })

    it('should respone 400 when empty body', done => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send({})
        .end((err, res) => {
          console.log(res.body)
          expect(res).to.have.status(400)
          done()
        })
    })

    it('should got error when submit existed email', done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/register')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(201)

          chai
            .request(server)
            .post('/api/auth/register')
            .send(body)
            .end((err2, res2) => {
              expect(res2).to.have.status(422)
              done()
            })
        })
    })
  })

  describe('POST /login', () => {
    beforeEach(done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/register')
        .send(body)
        .end(done)
    })

    it('should return 200 with access token when credential is valid', done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.access_token).exist
          done()
        })
    })

    it('should return 400 when body is empty', done => {
      const body = {}
      chai
        .request(server)
        .post('/api/auth/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })

    it('should return 401 when invalid password', done => {
      const body = {
        email: 'user@test.com',
        password: 'wrongpassword',
      }
      chai
        .request(server)
        .post('/api/auth/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(401)
          done()
        })
    })
  })

  describe('POST /forgot_password', () => {
    it('should return 201 with valid request body', done => {
      const body = {
        email: 'user@test.com',
      }
      chai
        .request(server)
        .post('/api/auth/forgot_password')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should got 400 with empty request body', done => {
      chai
        .request(server)
        .post('/api/auth/forgot_password')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })
  })

  describe('POST /verify_token', () => {
    beforeEach(done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/register')
        .send(body)
        .end(done)
    })

    it('should got 200 and token info if valid token', done => {
      const body = {
        email: 'user@test.com',
        password: 'password',
      }
      chai
        .request(server)
        .post('/api/auth/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.access_token).exist
          const accessToken = res.body.access_token
          chai
            .request(server)
            .post('/api/auth/verify_token')
            .set('Authorization', 'Bearer ' + accessToken)
            .end((err2, res2) => {
              expect(res2).to.have.status(200)
              done()
            })
        })
    })

    it('should got 401 when has no token', done => {
      chai
        .request(server)
        .post('/api/auth/verify_token')
        .end((err, res) => {
          expect(res).to.have.status(401)
          done()
        })
    })

    it('should got 401 when post invalid token', done => {
      chai
        .request(server)
        .post('/api/auth/verify_token')
        .set('Authorization', 'invalid token')
        .end((err, res) => {
          expect(res).to.have.status(401)
          done()
        })
    })
  })

  afterEach(done => {
    User.remove().exec(done)
  })
})
