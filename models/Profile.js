const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profile = new Schema({
    name: { type: String, default: ''},
    phone: { type: String, default: ''},
    address: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    bloodType: { type: String, default: '' },
    allergens: { type: String, default: '' },
    anamnesis: { type: String, default: '' },
    nameVisibility: { type: Boolean, default: true },
    phoneVisibility: { type: Boolean, default: true },
    addressVisibility: { type: Boolean, default: true },
    dateOfBirthVisibility: { type: Boolean, default: true },
    bloodTypeVisibility: { type: Boolean, default: true },
    allergensVisibility: { type: Boolean, default: true },
    anamnesisVisibility: { type: Boolean, default: true },
})

module.exports = mongoose.model('profile', profile)