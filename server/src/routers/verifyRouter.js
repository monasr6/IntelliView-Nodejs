const express = require('express');

const verifyController = require('../controllers/verifyController');

const router = express.Router();

router.get('/verifyEmail/:id/:token', verifyController.verifyEmail);

module.exports = router;
