const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contact')

router.route('/')
    .get(contactController.getContacts)
    .post(contactController.addContact)
router.route('/:contactId')
    .get(contactController.getContact)
    .put(contactController.updateContact)
    .delete(contactController.deleteContact)

module.exports = router