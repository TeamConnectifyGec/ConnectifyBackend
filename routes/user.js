const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinaryConfig');  
const {getUserById, updateUser} = require('../controllers/userProfileController');
const {createPost} = require('../controllers/userPostController');
const {createComment} = require('../controllers/userCommentController')


router.put('/profile', upload.single('file'), updateUser);

router.get('/profile', getUserById);

router.post('/create-post',upload.single('file'), createPost);

router.post('/create-comment', createComment );

module.exports = router;
