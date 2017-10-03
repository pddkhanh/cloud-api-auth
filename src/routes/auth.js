const express = require('express')
const path = require('path')

const router = express.Router()
const authCtrl = require('../controllers/auth')

router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.post('/auth/forgot_password', authCtrl.forgotPassword)

module.exports = router
