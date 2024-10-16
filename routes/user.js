const express = require('express');
const router = express.Router();
const { get } = require('mongoose');
const {getUserById, updateUser} = require('../controllers/userController');
const upload = require('../config/cloudinaryConfig');  // Cloudinary upload middleware


router.put('/profile', upload.single('pfp'), updateUser);

router.get('/profile', getUserById);

module.exports = router;
