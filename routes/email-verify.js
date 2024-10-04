const express = require('express');
const router = express.Router;
const emailverify = require('../controllers/emailVerificationController');

router.put('/email-verify',emailverify);

module.exports = router;