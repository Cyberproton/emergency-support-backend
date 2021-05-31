const mongoose = require('mongoose')

const User = require('../models/User')
const jwt = require('../utils/jwt')

exports.login = async (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
    
    let user
    try {
        user = await User.findById(username).exec()
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }

    if (user && password == user.password) {
        const access = await jwt.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE)
        const refresh = await jwt.generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE)
        res.status(200).json({ message: 'Login successfully', accessToken: access, refreshToken: refresh })
    } else {
        res.status(400).json({ message: 'Username does not exist or password is incorrect' })
    }
}

exports.loginAnonymously = async (req, res, next) => {
    const username = 'anonymous' + mongoose.Types.ObjectId().toHexString()
    const password = mongoose.Types.ObjectId().toHexString()
    const user = new User({ _id: username, password: password })
    try { 
        await user.save()
    } catch (err) {
        res.status(500).json({ message: 'Failed to login', error: err.message })
    }
    const access = await jwt.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE)
    const refresh = await jwt.generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE)
    res.status(200).json({ message: 'Login successfully', user: username, password: password, accessToken: access, refreshToken: refresh })
}