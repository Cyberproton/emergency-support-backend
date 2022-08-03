const User = require('../models/User')

exports.postLocation = (req, res, next) => {
    const username = req.jwtDecoded.user
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    const altitude = req.body.altitude

    if (!username) {
        res.status(401).json({ message: 'Could not authorized' })
        return
    }

    if (longitude == null || latitude == null || altitude == null) {
        res.status(400).json(
            {   
                message: 'Location elements is missing', 
                location: { 
                    long: longitude,
                    lat: latitude,
                    alt: altitude
                } 
            })
        return
    }

    User.findByIdAndUpdate(username, { currentLocation: { 
            longitude: longitude, 
            latitude: latitude,
            altitude: altitude
        } 
    }, (err, user) => {
        if (err) {
            res.status(500).json({ message: 'Could not update user location', error: err.message })
        } else {
            console.log("Location update for " + username)
            res.status(200).json({ message: 'User location updated successfully' })
        }
    }).exec()
}

exports.getYourLocation = (req, res, next) => {
    const username = req.jwtDecoded.user

    if (!username) {
        res.status(401).json({ message: 'Could not authorized' })
        return
    }

    User
        .findById(username)
        .exec()
        .then(user => {
            res.status(200).json({ message: 'Found your location', location: user.currentLocation })
        })
        .catch(err => res.status(500).json({ message: 'Something wrong happened', error: err.message }))
}

exports.getUserLocation = (req, res, next) => {
    const username = req.jwtDecoded.user
    const userId = req.params.id

    if (!username) {
        res.status(401).json({ message: 'Could not authorized' })
        return
    }

    if (!userId) {
        res.status(400).json({ message: 'Could not find user' })
        return
    }

    User
        .findById(userId)
        .exec()
        .then(user => {
            res.status(200).json({ message: 'Found user location', location: user.currentLocation })
        })
        .catch(err => 
            res.status(500).json({ message: 'Something wrong happened', error: err.message })
        )
}