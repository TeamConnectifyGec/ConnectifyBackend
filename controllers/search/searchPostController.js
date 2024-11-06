const Post = require('../../models/postModel');  // Assuming the Post model is in the models folder
const Like = require('../../models/likeModel');  // Assuming the Like model is in the models folder
const Comment = require('../../models/commentModel');  // Assuming the Comment model is in the models folder

exports.searchPosts = async (req, res) => {
  try {
    const { searchTerm } = req.body; // Get search term from request body
    const userId = req.user._id; // Get user ID from request (auth middleware)

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Perform a case-insensitive search on post title and check if searchTerm exists in post_hashes array
    const posts = await Post.find({
      $or: [
        { post_title: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search on post title
        { post_hashes: { $in: [searchTerm] } }  // Check if the search term exists in the post_hashes array
      ]
    })
    .populate('user_id', 'username name pfp_link')  // Populate user details excluding password
    .select('post_title post_content post_hashes post_image_link visibility post_points createdAt user_id');  // Select fields to return

    // If no posts are found, return a message
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // Create a response array with the required details
    const responsePosts = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post_id: post._id });
      const userLiked = await Like.findOne({ post_id: post._id, user_id: userId }) ? true : false;
      const commentCount = await Comment.countDocuments({ post_id: post._id });

      return {
        ...post.toObject(),
        likeCount,
        userLiked,
        commentCount
      };
    }));

    // Return the array of posts with like and comment details
    res.json(responsePosts);

  } catch (error) {
    console.error(`Error during search: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
