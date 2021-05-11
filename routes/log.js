var express = require('express');
var router = express.Router();

let requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

router.get('/', [requestTime], function(req, res, next) {
    var responseText = 'Hello World!<br>'
    responseText += '<small>Requested at: ' + req.requestTime + '</small>'
    res.send(responseText)
    next()
});

module.exports = router;