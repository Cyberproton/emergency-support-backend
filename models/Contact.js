const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contact = new Schema({
    name: { type: String, default: '' },
    phone: { type: Number, required: true }
})

module.exports = mongoose.model('contact', contact)