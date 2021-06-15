const User = require("../models/User");
const Contact = require("../models/Contact")

const getContacts = (req, res) => {
    const username = req.jwtDecoded.user;
    User.findById(username).exec()
        .then(user => res.status(200).json({ contacts: user.contacts }))
        .catch(err => res.status(500).json({ error: err }))
}

const getContact = (req, res) => {
    const username = req.jwtDecoded.user;
    const id = req.params.contactId
    User.findById(username).exec()
        .then(user => { 
            const contact = user.contacts.find(c => c._id.toString() === id)
            if (!contact) {
                res.status(400).json({ error: 'No contact found' })
                return
            }
            res.status(200).json({ contact: contact })
        })
        .catch(err => res.status(500).json({ error: err }))
}

const addContact = (req, res) => {
    const username = req.jwtDecoded.user;
    User.findById(username).exec()
        .then(user => {
            const contact = new Contact(req.body)
            user.contacts.push(contact)
            user.save()
                .then(user => {
                    res.status(200).json({ contact: user.contacts.id(contact._id) })
                })
                .catch(err => res.status(500).json({ error: err }))
        })
        .catch(err => res.status(500).json({ error: err }))
}

const updateContact = (req, res) => {
    const username = req.jwtDecoded.user
    const id = req.params.contactId
    User.findById(username).exec()
        .then(user => {
            const contact = user.contacts.id(id)
            if (!contact) {
                res.status(400).json({ error: 'No contact found' })
                return
            }
            if (req.body.name) {
                contact.name = req.body.name
            }
            if (req.body.phone) {
                contact.phone = req.body.phone
            }
            user.save()
                .then(user => res.status(200).json({ contact: user.contacts.id(id) }))
                .catch(err => res.status(500).json({ error: err }))
        })
        .catch(err => res.status(500).json({ error: err }))
}

const deleteContact = (req, res) => {
    const username = req.jwtDecoded.user
    const id = req.params.contactId
    User.findById(username).exec()
        .then(user => {
            const i = user.contacts.findIndex(c => c._id.toString() === id)
            if (i < 0) {
                res.status(400).json({ error: 'No contact found' })
                return
            }
            const contact = user.contacts.splice(i, 1)
            user.save()
                .then(user => res.status(200).json({ contact: contact }))
                .catch(err => res.status(500).json({ error: err }))
        })
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    getContacts: getContacts,
    getContact: getContact,
    addContact: addContact,
    updateContact: updateContact,
    deleteContact: deleteContact,
}