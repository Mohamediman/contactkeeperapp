const express = require('express');

const router = express.Router();

//@route        GET api/contacts
//@Desc          Get all the contacts for the user
//@Access        Private
router.get('/', (req, res) => {
    res.send("Get all contacts for the user");
});

//@route        POST api/contacts
//@Desc          Add a new contact
//@Access        Private
router.post('/', (req, res) => {
    res.send("Add a new Contact");
});


//@route        PUT api/contacts
//@Desc          Update a contact
//@Access        Private
router.put('/:id', (req, res) => {
    res.send("Updating Contact");
});

//@route        DELETE api/contacts
//@Desc          Delete a contact
//@Access        Private
router.delete('/:id', (req, res) => {
    res.send("Deleting Contacting");
})


module.exports = router;

