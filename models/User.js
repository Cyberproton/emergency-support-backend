const mongoose = require('mongoose')
const Contact = require('./Contact')
const Profile = require('./Profile')
const Schema = mongoose.Schema

const user = new Schema({
    _id: String,
    password: { type: String, required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date, default: Date.now },
    currentLocation: {
        longitude: Number,
        latitude: Number,
        altitude: Number,
    },
    profile: Profile.schema,
    contact: Contact.schema
})

module.exports = mongoose.model('user', user)