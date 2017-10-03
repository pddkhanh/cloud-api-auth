module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/cloud-api-dev',
    options: {
      useMongoClient: true,
    },
    debug: true,
  },
  jwt: {
    secret: 'n$cJ2VT!ADewH03gRQD1',
  },
  twilio: {
    serviceSid: 'ISf5dcbb97acc5402a8091e2e82adb27d9',
    // accountSid: 'AC7ef72cbc511b0a52b344d28b71d99a13',
    // authToken: '9f939d4c78137775f3bbcb21fa3b048a',
    apiSid: 'SKd3354aaac32fe6bc7bab40647599a21a',
    apiSecret: '1r16rFQd7VvLXaZig02wvFvJag0ukqBU',
  },
}
