const express = require('express');

const router = express.Router();


//@route        POST app/users
//@Desc          Register a new User
//@Access        public
router.post('/', (req, res) => {
    res.send("Register a new User");
})


module.exports = router;

