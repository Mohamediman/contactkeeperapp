const express = require('express');
const { body, validationResult } = require('express-validator');

const authController = require('../constrollers/authController');
const contactController = require('../constrollers/contactController');


const router = express.Router();

//@route        GET api/contacts
//@Desc          Get all the contacts for the user
//@Access        Private
router.route('/')
        .get( authController.auth, contactController.getAllContacts)
        .post(authController.auth, contactController.addContact);


//@route        PUT api/contacts
//@Desc          Update a contact
//@Access        Private
router.route('/:id')
    .put(authController.auth, contactController.updateContact) 
    .delete(authController.auth, contactController.deleteContact);

module.exports = router;

