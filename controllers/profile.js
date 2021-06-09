const User = require("../models/User");

const getProfile = (req, res, next) => {
    const username = req.jwtDecoded.user;

    if (!username) {
        res.status(401).json({ error: 'Not authorized' })
        return;
    }

    User.findById(username).exec()
        .then(user => res.status(200).json({ profile: user.profile }))
        .catch(err => res.status(500).json({ error: err }))
}

const updateProfile = (req, res, next) => {
    const username = req.jwtDecoded.user;

    if (!username) {
        res.status(401).json({ error: 'Not authorized' })
        return;
    }

    User.findByIdAndUpdate(username, {
            profile: req.body
        }, { new: true })
        .exec()
        .then(user => res.status(200).json({ user: user }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = { 
    getProfile: getProfile,
    updateProfile: updateProfile,
}