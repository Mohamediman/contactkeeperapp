const express = require("express");
const authController = require("../constrollers/authController");

const router = express.Router();

//==> signin and get the loged in user
router
	.route("/")
	.post(authController.loginIn)
	.get(authController.auth, authController.getLoginUser);

module.exports = router;
