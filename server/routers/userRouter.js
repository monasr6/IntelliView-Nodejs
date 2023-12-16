const express = require('express');

const userController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/forgotPassword', userController.forgotPassword);

router.patch('/resetPassword/:email/:token', userController.resetPassword);

module.exports = router;
