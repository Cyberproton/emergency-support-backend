const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profile = new Schema({
    name: { type: String, default: ''},
    phone: { type: String, default: ''},
    address: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    bloodType: { type: String, default: '' },
    allergens: [ String ],
    anamnesis: [ String ],
})

module.exports = mongoose.model('profile', profile)