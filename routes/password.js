const express = require('express');
const router = express.Router();
const path = require('path');
const {forgotPassword} = require('../controllers/forgetPasswordController'); 
const {resetPasswordForm} = require('../middleware/resetPasswordForm');
const {resetPasswordController} = require('../controllers/resetPasswordController');

router.get('/forgot-password',forgotPassword);

router.get('/reset-password', resetPasswordForm);

router.post('/reset-password',resetPasswordController);

module.exports = router;
