const User = require('../models/User')
const Case = require('../models/Case')
const firebaseAdmin = require('../config/firebase')
const getDistance = require('geolib')
const schedule = require('node-schedule')

var i = 0
const emulatorToken = 'e5J4AIUxRim3iImnugGFZi:APA91bGk9h25cu_YAZoNtK55S7MJ7MpcWq0_ClJtetxyAOv3AuAro5ZyUIGThXn6K8tPVgJQpvquJ4jFfB0TK0V4re4M6Vx6iX1Y9dCreOlb9NElMi5hFZTLuyeStljH5bax5zzxFZ72'
const jobs = { }

exports.startFindingHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user

    if (username) {
        let c = new Case({ caller: username, volunteer: [] })
        console.log(c)
        console.log(c._id)
        console.log(c.caller)
        c = await c.save()
        res.status(200).json({
            message: 'Created a new case',
            'case': c
        })
    } else {
        let c = new Case({ caller: 'anynomous' + i, volunteer: [] })
        c = await c.save()
        res.status(200).json({
            message: 'Created a new case',
            'case': c
        })
        schedule
    }
}

exports.findHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (!username) {
        res.status(400).json({ message: 'Could not authorized' })
        return
    }
    
    if (!caseId) {
        res.status(400).json({ message: 'No case specified' })
        return
    }

    try {
        const cs = await Case.findById(caseId).populate('caller').exec()
    } catch (err) {
        res.status(500).json({ message: 'Some error has happened '})
        return
    }

    const caller = cs.caller
    const users = await User.find().exec()
    users.filter(u => getDistance(u.getCurrentLocation, caller.currentLocation) < 2000)

    if (i % 2 == 0) {
        let volunteer = new User({ _id: 'volunteer', password: 'password' })
        res.json({ 'case': c, volunteers: [ volunteer ] })
        i++
    } else {
        res.json({ volunteers: [] })
        i++
    }
}

exports.stopFindingHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (!username) {
        res.status(400).json({ message: 'Could not authorized' })
        return
    }
    
    if (!caseId) {
        res.status(400).json({ message: 'No case specified' })
        return
    }

    const c = await Case.findById(caseId).exec()
    c.is_closed = true
    c.save()
    res.status(200).json({ 
        message: "You have closed help request with id: " + c._id,
        'case': c
    })
}

exports.acceptHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (username) {
        const c = await Case.findById(caseId).exec()
        if (c.is_closed) {
            res.status(400).json({ message: 'Case have already been closed', 'case': c })
            return
        }
        if (c.volunteers.includes(username)) {
            res.status(400).json({ message: 'You have already accepted the help request', 'case': c })
            return
        }
        c.volunteers.push(username)
        await c.save()
        firebaseAdmin.messaging().send({
            token: emulatorToken,
            data: {
                caller: c.caller,
                volunteer: username,
            },
            android: {
                priority: 'high'
            }
        }).then((success) => {
            res.status(200).json({ 
                message: 'You have accepted the help request', 
                'case': c,
                caller: c.caller, 
                you: username 
            })
        }, (reject) => {
            res.status(500).json({ message: 'Server error', error: reject })
        })
    } else {
        res.status(401).json({ message: 'Could not authorized' })
    }
}

exports.refuseHelp = async (req, res, next) => {
    const username = req.jwtDecoded.user
    const caseId = req.body.case

    if (username) {
        let cs
        try {
            cs = await Case.findById(caseId).exec()
        } catch (err) {
            res.status(500).json({ message: 'Some error has happened ', error: err.message })
            return
        }

        if (cs.is_closed) {
            res.status(400).json({ message: 'Case have already been closed', 'case': c })
            return
        }

        const i = cs.volunteers.indexOf(username)
        if (i < 0) {
            res.status(400).json({ message: 'You have not accepted the help request', 'case': c })
            return
        }
        cs.volunteers.splice(i, 1)

        await cs.save()
    } else {
        res.status(401).json({ messsage: 'Could not authorized' })
    }
}

const scheduleFind = () => {

}