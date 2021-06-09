const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile')

router.route('/')
    .get(profileController.getProfile)
    .put(profileController.updateProfile)

module.exports = router