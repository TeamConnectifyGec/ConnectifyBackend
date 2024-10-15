const express = require('express');
const router = express.Router();
const { get } = require('mongoose');
const {getUserById, updateUser} = require('../controllers/userController');
const upload = require('../config/cloudinaryConfig');  // Cloudinary upload middleware


router.put('/:id', upload.single('pfp'), updateUser);

router.get('/:id', getUserById);

module.exports = router;
