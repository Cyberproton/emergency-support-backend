const jwt = require("jsonwebtoken")

const generateToken = (user, secret, tokenLife) => {
    return new Promise((resolve, reject) => {
        const username = user._id
        jwt.sign(
            { user: username }, 
            secret, 
            { algorithm: "HS256", expiresIn: tokenLife }, 
            (err, token) => {
                if (err) { 
                    return reject(err)
                }
                resolve(token)
            })
    })
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return reject(err)
            }
            resolve(decoded)
        })
    })
}

module.exports = { generateToken: generateToken, verifyToken: verifyToken }
