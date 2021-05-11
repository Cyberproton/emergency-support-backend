const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    username: { type: String, default: ''},
    password: { type: String, default: ''},

    loginAt: { type: Date, default: Date.now},
    logoutAt: { type: Date, default: Date.now},
    
}, { collection: 'user' })

module.exports = mongoose.model('user', login)