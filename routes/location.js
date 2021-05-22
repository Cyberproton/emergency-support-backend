const express = require('express')
const { postLocation } = require('../controllers/location')
const router = express.Router()

router.route('/').post(postLocation)

module.exports = router