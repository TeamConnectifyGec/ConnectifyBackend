const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { emailVerification } = require('../controllers/emailVerificationController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/email-verify',emailVerification);


module.exports = router;
