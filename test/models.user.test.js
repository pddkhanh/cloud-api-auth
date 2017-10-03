process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const mongo = require('../src/components/mongo')
const User = require('../src/models/user')

let user1
let user2

describe('User model', () => {
  before(done => {
    user1 = {
      firstName: 'First 1',
      lastName: 'Last 1',
      email: 'user1@test.com',
      password: 'password1',
      provider: 'local',
    }
    user2 = {
      firstName: 'First 2',
      lastName: 'Last 2',
      email: 'user2@test.com',
      password: 'password2',
      provider: 'local',
    }
    mongo.connect(() => {
      done()
    })
  })

  afterEach(done => {
    User.remove().exec(done)
  })

  describe('Method save', () => {
    it('should begin with no users', done => {
      User.find({}, (err, rs) => {
        expect(err).not.exist
        expect(rs).be.empty
        done()
      })
    })
    it('should be able to save without error', done => {
      const user = new User(user1)
      user.save((err, rs) => {
        expect(err).not.exist
        expect(rs.email).equal(user1.email)
        done()
      })
    })

    it('should failed when email is invalid', done => {
      const user = new User(user1)
      user.email = 'invalidemail'
      user.save((err, rs) => {
        expect(err).exist
        done()
      })
    })

    it('should failed when email is empty', done => {
      const user = new User(user1)
      user.email = ''
      user.save((err, rs) => {
        expect(err).exist
        done()
      })
    })

    it('should failed when password is empty', done => {
      const user = new User(user1)
      user.password = ''
      user.save((err, res) => {
        expect(err).exist
        done()
      })
    })

    it('should fail to save exist user again', done => {
      const user = new User(user1)
      const sameUser = new User(user1)
      user.save(err => {
        expect(err).not.exist
        sameUser.save(err2 => {
          expect(err2).exist
          done()
        })
      })
    })

    it('should confirm that saving user model does not change the password', done => {
      const user = new User(user1)
      user.save((err, savedUser) => {
        expect(err).not.exist
        expect(savedUser).exist
        const oldPassword = savedUser.password
        savedUser.firstName = 'Updated'
        savedUser.save((err, savedUser2) => {
          expect(err).not.exist
          expect(savedUser2).exist
          expect(savedUser2.password).is.equal(oldPassword)

          done()
        })
      })
    })

    it('should be able to save 2 different users', done => {
      const dbUser1 = new User(user1)
      dbUser1.save(err => {
        expect(err).not.exist
        const dbUser2 = new User(user2)
        dbUser2.save(err2 => {
          expect(err2).not.exist
          done()
        })
      })
    })

    it('should not be able to save another user with same email address', done => {
      const dbUser1 = new User(user1)
      const dbUser2 = new User(user2)
      dbUser2.email = user1.email
      dbUser1.save(err => {
        expect(err).not.exist
        dbUser2.save(err2 => {
          expect(err2).exist
          done()
        })
      })
    })

    it('should not index missing email field, thus not enfore the model unique index', done => {
      const dbUser1 = new User(user1)
      const dbUser2 = new User(user2)
      dbUser1.email = undefined
      dbUser2.email = undefined
      dbUser1.save(err => {
        expect(err).not.exist
        dbUser2.save(err2 => {
          expect(err2).not.exist
          done()
        })
      })
    })

    it('should hash password before save', done => {
      const user = new User(user1)
      user.save((err, savedUser) => {
        expect(err).not.exist
        expect(savedUser).exist
        expect(savedUser.password).not.equal(user1.password)
        expect(savedUser.password).is.not.empty
        done()
      })
    })

    it('should has unique twilioIdentity', done => {
      const dbUser1 = new User(user1)
      const dbUser2 = new User(user2)
      dbUser1.save((err, saved1) => {
        expect(err).not.exist
        expect(saved1.twilioIdentity).not.empty
        dbUser2.save((err2, saved2) => {
          expect(err2).not.exist
          expect(saved2.twilioIdentity).not.empty
          expect(saved2.twilioIdentity).not.equal(saved1.twilioIdentity)
          done()
        })
      })
    })

    it('should confirm that saving user model does not change the twilioIdentity', done => {
      const user = new User(user1)
      user.save((err, savedUser) => {
        expect(err).not.exist
        expect(savedUser).exist
        const oldIdentity = savedUser.twilioIdentity
        savedUser.firstName = 'Updated'
        savedUser.save((err, savedUser2) => {
          expect(err).not.exist
          expect(savedUser2).exist
          expect(savedUser2.twilioIdentity).is.equal(oldIdentity)

          done()
        })
      })
    })
  })

  describe('user password authentication', () => {
    it('should authenticate success with valid password', done => {
      const dbUser = new User(user1)
      dbUser.save((err, savedUser) => {
        expect(err).not.exist
        expect(savedUser.authenticate(user1.password)).be.true
        done()
      })
    })

    it('should not authenticate success with invalid password', done => {
      const dbUser = new User(user1)
      dbUser.save((err, savedUser) => {
        expect(err).not.exist
        expect(savedUser.authenticate('wrongpass')).be.false
        done()
      })
    })
  })
})
