const mongoose = require('mongoose')
const Schema = mongoose.Schema

const help_case = new Schema({
    caller: { type: String, required: true },
    volunteers: [ String ],
    is_closed: { type: Boolean, default: false },
    location: { type: String, default: '' }
})

module.exports = mongoose.model('help_case', help_case)