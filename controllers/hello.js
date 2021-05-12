exports.postHello = (req, res, next) => {
    let hello = "Hello World"
    console.log(JSON.stringify(req.body))
    if (req.body.helloMessage) {
        hello = req.body.helloMessage
    }
    res.send(JSON.stringify({ helloMessage: hello }))
}

exports.getHello = (req, res, next) => {
    res.send(JSON.stringify({ helloMessage: "Hello World!" }))
}