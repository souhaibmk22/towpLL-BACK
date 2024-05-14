const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controller');
const UserService = require("../services/user.services"); // Import UserService module

// Define the route for handling POST requests to "/login"
router.post('/registration', UserController.register);
router.post('/login', UserController.login);

// POST /api/save-location
router.post('/saveLocation',UserController.saveLocation);

// Define the route for handling POST requests to "/registration"
router.post('/otpLogin', UserController.otpLogin);
router.post('/verifyOTP', UserController.verifyOTP);

module.exports = router;
