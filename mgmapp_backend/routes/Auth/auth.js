const express = require('express');
const router = express.Router();
const authController = require('../../controllers/Auth/authController');
const { loginLimiter } = require('../../middleware/rateLimiter');

router.post('/', loginLimiter, authController.handleLogin);

module.exports = router;