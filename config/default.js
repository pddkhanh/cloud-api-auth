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
}
