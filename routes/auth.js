const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middlewares/auth');

const User = require('../models/User');

const router = express.Router();

//@route        GET app/auth
//@Desc          Get the loged in user
//@Access        Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ user });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "internal Server Error"})
    }
})

//@route        POST app/users
//@Desc          Sign in a returning user and send token back
//@Access        public
router.post('/', 
    body('email', 'Please add a valid email').isEmail(),
    body('password', 'Enter a password').exists(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if(!user) res.status(400).json({msg: "invalid Credentials"});

        //=== Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);


        if(!isMatch) res.status(400).json({msg: "invalid Credentials"});

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
    })


module.exports = router;

