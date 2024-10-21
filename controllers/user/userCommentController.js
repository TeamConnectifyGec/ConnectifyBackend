const Comment = require('../../models/commentModel');
const Post = require('../../models/postModel');

// Add a comment to a post
exports.createComment = async (req, res) => {
  const { post_id, comment_text } = req.body;

  try {
    const post = await Post.findById(post_id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      user_id: req.user._id,  // Assumes user is already authenticated and `req.user` is set
      post_id,
      comment_text,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAllUserComments = async (req, res) => {
  const userId = req.user._id; // Assuming userId is available from a logged-in session or token

  try {
    // Find all comments made by the user
    const comments = await Comment.find({ user_id: userId });

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this user' });
    }

    return res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all comments for a specific post
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.post_id }).populate('user_id', 'username');

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the owner of the comment or if the user has admin rights
    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.remove();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
