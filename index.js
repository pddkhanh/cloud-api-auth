const app = require('./src/app')
const debug = require('debug')('cloud-api:server')
const http = require('http')
const mongo = require('./src/components/mongo')

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Binding requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error('Binding is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
   * Event listener for HTTP server "listening" event.
   */

function onListening() {
  debug('Server is listening...')
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const portValue = parseInt(val, 10)

  if (isNaN(portValue)) {
    // named pipe
    return val
  }

  if (portValue >= 0) {
    // port number
    return portValue
  }

  return false
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)

mongo.connect(() => {
  server.listen(port)
})

server.listen(port)
