const express = require('express');
const router = express.Router();
const {searchUsers} = require('../controllers/search/searchUsersController');
const {searchPosts} = require('../controllers/search/searchPostController');
const {searchCommunities} = require('../controllers/search/searchCommunitiesController');
const {getComments} = require('../controllers/search/searchCommentsController');
const {getUserFeed} = require('../controllers/search/feed');

router.get('/users', searchUsers);

router.get('/posts', searchPosts);

router.get('/communities', searchCommunities);

router.get('/comments', getComments);

router.get('/feed', getUserFeed);

module.exports = router;
