const mongoose = require('mongoose')
const Schema = mongoose.Schema

const help_case = new Schema({
    caller: { type: String, required: true, ref: 'user' },
    volunteers: [ { type: String, ref: 'user' } ],
    is_closed: { type: Boolean, default: false },
    location: { type: String, default: '' },
    searchRadius: { type: Number, default: 5000 }
})

module.exports = mongoose.model('help_case', help_case)