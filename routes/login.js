const express = require('express')
const { login, loginAnonymously } = require('../controllers/login')
const router = express.Router()

router.route('/').post(login)
router.route('/anonymous').post(loginAnonymously)

module.exports = router