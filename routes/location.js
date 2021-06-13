const express = require('express')
const { postLocation, getYourLocation, getUserLocation } = require('../controllers/location')
const router = express.Router()

router.route('/').post(postLocation)
router.route('/').get(getYourLocation)
router.route('/:id').get(getUserLocation)

module.exports = router