const submitRegistrationToken = (req, res) => {
    const token = req.body.registrationToken
    const user = 1
    console.log('Notification token received: ' + token)
    res.status(200).json({ message: 'Token received ' + token })
}


module.exports = { submitRegistrationToken: submitRegistrationToken }