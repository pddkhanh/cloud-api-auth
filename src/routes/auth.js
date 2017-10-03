const express = require('express')
const path = require('path')

const router = express.Router()
const authCtrl = require('../controllers/auth')
const passport = require('../components/passport')

router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.post('/auth/forgot_password', authCtrl.forgotPassword)
router.post('/auth/verify_token', passport.authenticate(), authCtrl.verifyToken)

module.exports = router
