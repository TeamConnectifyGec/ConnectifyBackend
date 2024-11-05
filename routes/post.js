const express = require('express');
const router = express.Router();

const {addLike} = require('../controllers/post/postLikeController');


router.post('/like', addLike);

module.exports = router;
