const User = require('../models/User')

async function register(req, res, next) {
    let username = req.body.username
    let password = req.body.password

    if (!username || !password) {
        res.status(400).json({ message: 'Username or Password is invalid' })
        return
    }

    let existed = await User.exists({ _id: username })

    if (existed) {
        res.status(400).json({ message: 'Username already exists' })
        return
    }

    let user = new User({ _id: username, password: password })
    user.save((err, user) => {
        if (err) {
            res.status(500).json({ message: 'Could not create your account', error: err.message })
        } else {
            res.status(201).json({ message: 'User registered successfully', user: user })
        }
    })
}

module.exports = { register: register }