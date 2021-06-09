const express = require('express');

const router = express.Router();

//@route        GET app/auth
//@Desc          Get the loged in user
//@Access        Private
router.get('/', (req, res) => {
    res.send("Get loged in user");
})

//@route        POST app/users
//@Desc          Authenticate a user by the token from the header => basically loging in a user
//@Access        public
router.post('/', (req, res) => {
    res.send("Authenticate a User based on the token from the header");
})


module.exports = router;

