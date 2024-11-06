const express = require('express');
const router = express.Router();

const {connectionRequestController} = require('../controllers/notification/connectionRequestController');


router.post('/connection-request',connectionRequestController);

module.exports = router;
