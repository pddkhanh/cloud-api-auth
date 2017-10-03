const express = require('express')

const router = express.Router()
const twilioCtrl = require('../controllers/twilio')
const passport = require('../components/passport')

router.post('/twilio/token', passport.authenticate(), twilioCtrl.token)

module.exports = router
