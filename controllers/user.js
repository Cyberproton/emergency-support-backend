const User = require('../models/User')

// GET /api/user/<username>
exports.checkUser = (req, res, next) => {
    const username = req.params.userId
    User.findById(username)
        .then(user => { 
            if (user) {
                user.password = ''
            }
            res.status(200).json({ user: user }) 
        })
        .catch(err => res.status(500).json({ error: err.message }))
}

// PUT /api/user/<username>
exports.updateUser = (req, res, next) => {
    const username = req.params.userId
    const password = req.body.password
    if (!password) {
        res.status(400).json({ message: 'Password must not be empty' })
        return
    }
    User.findByIdAndUpdate(username, { password: password })
        .then(user => { 
            user.password = ''
            res.status(200).json({ user: user }) 
        })
        .catch(err => res.status(500).json({ error: err.message }))
}