const Comment = require('../../models/commentModel');
const User = require('../../models/userModel');

// Controller to get all comments for a specific post by post ID
exports.getComments = async (req, res) => {
  try {
    const { post_id } = req.body;

    // Check if post_id is provided
    if (!post_id) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    // Find all comments related to the post
    const comments = await Comment.find({ post_id: post_id })
      .populate('user_id', 'username email') // Populate user info (optional fields)
      .sort({ createdAt: -1 }); // Sort comments by most recent

    // Check if comments exist
    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(`Error fetching comments: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

