const express = require('express');
const router = express.Router();
const createCommunityController = require('../controllers/communityController');  // Adjust path based on your file structure

router.post('/create', createCommunityController);

module.exports = router;
