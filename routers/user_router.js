const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controller');
const UserService = require("../services/user.services");



router.post('/registration', UserController.register);//use it on sign up
router.post('/login', UserController.login);// on sign in
router.post('/saveLocation',UserController.saveLocation);//to update user location

// u need to give the user id
router.get('/profile/:userId', UserController.getUserProfile);//u can usre it on pprofile page or any page that u can need the user info
router.put('/profile/:userId', UserController.updateUserProfile);
router.delete('/profile/:userId', UserController.deleteUser);

router.get('/towers', UserService.getTowerLocations); // to get all towers locations on the map
router.get('/tower/:id', UserService.getTowerInfo); // to display tower s infor like number so driver can call them
  


// generat otp and verify 

router.post('/otpLogin', UserController.otpLogin);
router.post('/verifyOTP', UserController.verifyOTP);

module.exports = router;
