const User = require('../models/User')
const Case = require('../models/Case')
const firebaseAdmin = require('../config/firebase')

var i = 0
const emulatorToken = 'e5J4AIUxRim3iImnugGFZi:APA91bGk9h25cu_YAZoNtK55S7MJ7MpcWq0_ClJtetxyAOv3AuAro5ZyUIGThXn6K8tPVgJQpvquJ4jFfB0TK0V4re4M6Vx6iX1Y9dCreOlb9NElMi5hFZTLuyeStljH5bax5zzxFZ72'

exports.startFindingHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user

    if (username) {
        let c = new Case({ caller: username, volunteer: [] })
        console.log(c)
        console.log(c._id)
        console.log(c.caller)
        c = await c.save()
        res.status(200).json({
            id: c._id,
            caller: c.caller
        })
    } else {
        let c = new Case({ caller: 'anynomous' + i, volunteer: [] })
        c = await c.save()
        res.status(200).json({
            id: c._id,
            caller: username
        })
    }
}

exports.findHelp = (req, res, next) => {
    let username = req.body.user
    let callingCase = req.body.case
    // Find nearby users
    if (i % 2 == 0) {
        let volunteer = new User({ _id: 'volunteer', password: 'password' })
        res.json({ volunteers: [ volunteer ] })
        i++
    } else {
        res.json({ volunteers: [] })
        i++
    }
}

exports.stopFindingHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (username) {
        const c = await Case.findById(caseId).exec()
        c.is_closed = true
        c.save()
        res.status(200).json({ message: "You have closed help request with id: " + c._id } )
    } else {
        res.status(401).json({ message: 'Could not authorized' })
    }
}

exports.acceptHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (username) {
        const c = await Case.findById(caseId).exec()
        if (c.is_closed) {
            res.status(400).json({ message: 'Case have already been closed' })
            return
        }
        if (c.volunteers.includes(username)) {
            res.status(400).json({ message: 'You have already accepted the help request' })
            return
        }
        c.volunteers.push(username)
        firebaseAdmin.messaging().send({
            token: emulatorToken,
            data: {
                caller: c.caller,
                volunteer: username,
            }
        }).then((success) => {
            res.status(200).json({ message: 'You have accepted the help request', caller: c.caller, you: username })
        }, (reject) => {
            res.status(200).json({ message: 'Server error', error: reject })
        })
    } else {
        res.status(401).json({ message: 'Could not authorized' })
    }
}