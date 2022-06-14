const express = require("express");

const authController = require("../constrollers/authController");

const router = express.Router();

//@route        POST app/users
//@Desc          Register a new User
//@Access        public
router.route("/").post(authController.signUp);

module.exports = router;
