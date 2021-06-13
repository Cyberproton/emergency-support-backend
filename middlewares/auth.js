const jwt = require('../utils/jwt')

const checkAuth = async (req, res, next) => {
    const token = req.headers['x-access-token']

    if (token) {
        try {
            const decoded = await jwt.verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
            req.jwtDecoded = decoded
            next()
        } catch (err) {
            res.status(401).json({ message: 'Could not authorized', error: err.message })
        }
    } else {
        res.status(403).json({ message: 'Required authencation' })
    }
}

module.exports = { checkAuth: checkAuth }