const jwt = require('../utils/jwt')
const storage = require('../utils/storage')

const checkAuthSocket = async (socket, next) => {
    const token = socket.handshake.headers['x-access-token']
    if (token) {
      try {
          const decoded = await jwt.verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
          socket.jwtDecoded = decoded
          socket.user = decoded.user
          storage.socketIds[decoded.user] = socket.id
          console.log(storage.socketIds)
          next()
      } catch (err) {
          console.log('Error: ' + err.message)
          //res.status(401).json({ message: 'Could not authorized', error: err.message })
      }
    } else {
      console.log('Error: Require authencation')
    }
}

module.exports = { checkAuthSocket: checkAuthSocket }