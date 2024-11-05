const Post = require('../../models/postModel'); // Assuming the Post model
const Like = require('../../models/likeModel'); // Assuming the Like model

// Controller to add or remove a like from a post
exports.addLike = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from auth middleware
    const { postId } = req.body; // Post ID from request body

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user_id: userId, post_id: postId });

    if (existingLike) {
      // User has already liked the post, so remove the like
      await Like.deleteOne({ _id: existingLike._id });

      // Decrease the post points (likes count)
      await Post.findByIdAndUpdate(postId, { $inc: { post_points: -1 } });

      return res.status(200).json({ message: 'Post unliked' });
    } else {
      // User has not liked the post, so add a like
      const newLike = new Like({
        user_id: userId,
        post_id: postId
      });
      await newLike.save();

      // Increase the post points (likes count)
      await Post.findByIdAndUpdate(postId, { $inc: { post_points: 1 } });

      return res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.error(`Error adding like: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
