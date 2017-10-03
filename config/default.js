module.exports = {
  app: {
    name: 'CloudAPI',
  },
  db: {
    uri: process.env.MONGO_URI,
    options: {
      useMongoClient: true,
    },
    debug: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  twilio: {
    serviceSid: process.env.TWILIO_SERVICE_SID,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    apiSid: process.env.TWILIO_API_SID,
    apiSecret: process.env.TWILIO_API_SECRET,
  },
}
