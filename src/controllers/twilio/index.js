const config = require('config')
const _ = require('lodash')
const twilio = require('twilio')

const AccessToken = twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const User = require('../../models/user')
const errorHandler = require('./../core/error')

exports.token = (req, res) => {
  const identity = req.user.twilioIdentity
  const deviceId = req.body.deviceId
  if (_.isEmpty(deviceId)) {
    return res.status(400).send({
      code: errorHandler.errorCodes.REQUEST_DATA_MISSING,
      message: 'Device ID is missing',
    })
  }

  const appName = config.get('app.name')

  // Create a unique ID for the client on their current device
  const endpointId = appName + ':' + identity + ':' + deviceId

  // Create a "grant"

  const chatGrant = new ChatGrant({
    serviceSid: config.get('twilio.serviceSid'),
    endpointId: endpointId,
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    config.get('twilio.accountSid'),
    config.get('twilio.authToken'),
    config.get('twilio.apiSecret'),
    {
      ttl: -1, //24 * 60 * 60,
    },
  )

  token.addGrant(chatGrant)
  token.identity = identity

  // console.log(token)

  res.status(200).send({
    twilioToken: token.toJwt(),
  })
}
