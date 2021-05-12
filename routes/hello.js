const express = require('express')
const { postHello, getHello } = require('../controllers/hello')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send(JSON.stringify({ helloMessage: "Hello World!" }))
})

router.post('/', (req, res, next) => {
    let hello = "Hello World"
    if (req.body.helloMessage) {
        hello = req.body.helloMessage
    }
    res.send(JSON.stringify({ helloMessage: hello }))
})

//router.route('/')
//    .post(postHello)
//    .get(getHello)

module.exports = router