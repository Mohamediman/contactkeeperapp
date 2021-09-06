const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../constrollers/authController');

const router = express.Router();

//==> signin and get the loged in user
router.route('/')
    .post(authController.loginIn)
    .get(authController.auth, authController.getLoginUser);


module.exports = router;

