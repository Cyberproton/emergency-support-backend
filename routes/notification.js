const express = require('express')
const firebaseAdmin = require('../config/firebase')
const { submitRegistrationToken } = require('../controllers/notification')
const router = express.Router()

const token = 'e7oLuOHSTVaKeUDv8sfpDJ:APA91bHzhCyTYOREbmHyM7MtW4VWJaK2ZbextFT8D3JxvJzz24XSNEqyPPk8XxTXgoRq9R7ILUF-b04tBy6EOubdbjmzw_M8p6Gq4T7285KoI1P9pAdqrrLx7bRk8oqQZkFkHF6MFiRA'
const emulatorToken = 'e5J4AIUxRim3iImnugGFZi:APA91bGk9h25cu_YAZoNtK55S7MJ7MpcWq0_ClJtetxyAOv3AuAro5ZyUIGThXn6K8tPVgJQpvquJ4jFfB0TK0V4re4M6Vx6iX1Y9dCreOlb9NElMi5hFZTLuyeStljH5bax5zzxFZ72'

router.route('/token').post(submitRegistrationToken)
router.route('/').post((req, res) => {
    firebaseAdmin.messaging().send({
        token: emulatorToken,
        "notification": {
            "title":"Some title",
            "body":"great match!"
        },

        "android": {
            "priority":"high"
        },
    })
    res.status(200).json({ message: 'ok' })
})

module.exports = router