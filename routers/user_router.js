const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controller');
const UserService = require("../services/user.services");



router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.post('/saveLocation',UserController.saveLocation);
router.post('/otpLogin', UserController.otpLogin);
router.post('/verifyOTP', UserController.verifyOTP);

module.exports = router;
