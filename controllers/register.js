const Profile = require('../models/Profile')
const User = require('../models/User')

async function register(req, res, next) {
    let username = req.body.username
    let password = req.body.password
    const phone = req.body.phone

    if (!username || !password) {
        res.status(400).json({ message: 'Username or Password is invalid' })
        return
    }

    let existed = await User.exists({ _id: username })

    if (existed) {
        res.status(400).json({ message: 'Username already exists' })
        return
    }

    const profile = new Profile()
    if (phone) {
        profile.phone = phone
    }

    let data = {}
    data._id = username
    data.password = password
    data.profile = profile

    let user = new User(data)
    user.save((err, user) => {
        if (err) {
            res.status(500).json({ message: 'Could not create your account', error: err.message })
        } else {
            user.password = ''
            res.status(201).json({ message: 'User registered successfully', user: user })
        }
    })
}

module.exports = { register: register }