var express = require('express');
const User = require('../models/User');
const router = express.Router();
const { checkUser, updateUser } = require('../controllers/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find().exec().then(users => res.json(users))
});
router.route('/:userId').get(checkUser).put(updateUser)

module.exports = router;
