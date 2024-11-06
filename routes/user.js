const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinaryConfig');  
const {getUserById, updateUser} = require('../controllers/user/userProfileController');
const {createPost, getAllUserPosts} = require('../controllers/user/userPostController');
const {createComment, getAllUserComments} = require('../controllers/user/userCommentController')
const {addConnection,getConnections,getConnectionsCount,acceptConnection,cancelConnection,rejectConnection} = require('../controllers/user/userConnectionsController');
const {getUserCommunities,getUserJoinedCommunitiesCount,joinCommunity} = require('../controllers/user/userCommunitiesController');

// profile
router.put('/profile', upload.single('file'), updateUser);

router.get('/profile', getUserById);

//posts
router.post('/create-post',upload.single('file'), createPost);

router.get('/posts', getAllUserPosts);

//comments
router.post('/create-comment', createComment );

router.get('/comments', getAllUserComments);

//connections
router.post('/connections/add', addConnection);

router.get('/connections/all', getConnections);

router.get('/connections/count', getConnectionsCount);

router.post('/connections/accept', acceptConnection);

router.post('/connections/cancle', cancelConnection);

router.post('/connections/reject', rejectConnection);

//communities
router.post('/communities/join', joinCommunity);

router.get('/communities/all', getUserCommunities);

router.get('/communities/count', getUserJoinedCommunitiesCount);

module.exports = router;
