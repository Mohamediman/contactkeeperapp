const express = require("express");

const authController = require("../constrollers/authController");
const contactController = require("../constrollers/contactController");

const router = express.Router();

router
	.route("/")
	.get(authController.auth, contactController.getAllContacts)
	.post(authController.auth, contactController.addContact);

router
	.route("/:id")
	.put(authController.auth, contactController.updateContact)
	.delete(authController.auth, contactController.deleteContact);

module.exports = router;
