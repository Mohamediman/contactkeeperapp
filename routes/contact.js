const express = require('express');
const auth = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

const router = express.Router();

//@route        GET api/contacts
//@Desc          Get all the contacts for the user
//@Access        Private
router.get('/', 
            auth,
            async(req, res) => {
    try {
        let contacts = await Contact.find({ user: req.user.id}).sort({ date: -1 });
        res.status(200).json({ contacts });
    } catch (err) {
        console.error(err.message);
       res.status(500).send("Server Error");
    }
});

//@route        POST api/contacts
//@Desc          Add a new contact
//@Access        Private
router.post('/', auth, 
        body('name', 'Please add a Name').not().isEmpty(),
        async (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
        try {
            const { name, email, phone, type } = req.body;

            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            })
         const contact = await newContact.save();
        res.status(200).json({ contact });

        } catch (err) {
           res.status(500).send("Server Error");
        }
});


//@route        PUT api/contacts
//@Desc          Update a contact
//@Access        Private
router.put('/:id', auth, async(req, res) => {
    //===== get the inputs from the user
    const { name, email, phone, type } = req.body;

    //==== build the new Contact Object from the user input
    const newContact = {};
    if(name) newContact.name = name;
    if(email) newContact.email = email;
    if(phone) newContact.phone = phone;
    if(type) newContact.type = type;

    
    try {
        //====Check if the contact is there
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({ msg: "No contact Found."})

        //===== Check if the user owns the contact before updating it
        if(contact.user.toString() !== req.user.id) return res.status(401).json({ msg: "Not Authorized to Update" });

        //==== Save the updated Contact
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, 
                                {$set: newContact}, 
                                {new: true});
        res.status(200).json({ updatedContact });
    } catch (err) {
        console.error(err.message);
       res.status(500).send("Server Error");
    }

});

//@route        DELETE api/contacts
//@Desc          Delete a contact
//@Access        Private
router.delete('/:id', auth, async(req, res) => {
    try {
        //====Check if the contact is there
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({ msg: "No contact Found."})

        //===== Check if the user owns the contact before updating it
        if(contact.user.toString() !== req.user.id) return res.status(401).json({ msg: "Not Authorized to Update" });

        //==== Save the updated Contact
         await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg: "Contact removed..." });
        
    } catch (err) {
        console.error(err.message);
       res.status(500).send("Server Error");
    }
})


module.exports = router;

