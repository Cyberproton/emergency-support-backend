const mongoose = require('mongoose')
const Contact = require('./Contact')
const Profile = require('./Profile')
const Schema = mongoose.Schema

const user = new Schema({
    _id: { type: String, alias: 'username' },
    password: { type: String, required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date, default: Date.now },
    currentLocation: {
        longitude: Number,
        latitude: Number,
        altitude: Number,
    },
    profile: Profile.schema,
    contacts: { type: [ Contact.schema ], default: [] }
})

module.exports = mongoose.model('user', user)