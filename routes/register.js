const express = require('express')
const { register } = require('../controllers/register')
const router = express.Router()

router.route('/').post(register)

module.exports = router