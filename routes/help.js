const express = require('express')
const { startFindingHelp, findHelp, stopFindingHelp, acceptHelp } = require('../controllers/help')
const router = express.Router()

router.route('/start').post(startFindingHelp)
router.route('/find').get(findHelp)
router.route('/stop').post(stopFindingHelp)
router.route('/accept').post(acceptHelp)

module.exports = router