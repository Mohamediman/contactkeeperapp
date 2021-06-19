const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

const router = express.Router();


//@route        POST app/users
//@Desc          Register a new User
//@Access        public
router.post('/', 
    [
    body('name', 'Please add a Name').not().isEmpty(),
    body('email', 'Please add a valid email').isEmail(),
    body('password', 'Enter a password of at least 6 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            email,
            password
         } = req.body;

         try {
             let user = await User.findOne({email});
             if(user){
                 res.status(400).send({msg: "The User already exists"})
             }
             user = new User({name, email, password});
            //====Hashing the password
             const salt = await bcrypt.genSalt(10);
             user.password = await bcrypt.hash(password, salt);

             //=====Save the user into the database
             await user.save();

             //====Create payload for the toke
             const payload = {
                 user: {
                     id: user.id
                 }
             };

             //====Sign in and send the token back
            jwt.sign(payload, config.get('secret'), {
                expiresIn: 36000
            }, (err, token) =>{
                if(err) throw err;
                res.json({ token })
            });

         } catch (err) {
             console.error(err.message);
             res.status(500).send("Server Error");
         }

    })


module.exports = router;

