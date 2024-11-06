const Post = require('../../models/postModel');  // Assuming the Post model is in the models folder
const Like = require('../../models/likeModel');  // Assuming the Like model is in the models folder
const Comment = require('../../models/commentModel');  // Assuming the Comment model is in the models folder
const cloudinary = require('../../config/cloudinaryConfig');

exports.createPost = async (req, res) => {
  try {
    const { post_title, post_content, visibility, community_id, post_hashes } = req.body;
    const userId = req.user._id;

      console.log(req.body);
    // Ensure required fields are provided
    if (!post_title) {
      return res.status(400).json({ message: 'Post title is required' });
    }

    // Initialize the post object with required fields
    let newPost = new Post({
      user_id: userId,
      post_title,
      post_content,
      visibility: visibility || 'public', // Default visibility to public if not provided
      community_id: community_id || null, // Optional community reference
      post_hashes: post_hashes || [], // Optional post hashes (empty array if not provided)
    });

    // If an image is provided, process it with Cloudinary
    if (req.file) {
      newPost.post_image_link = req.file.path; // Store Cloudinary URL for the post image
    }

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json(savedPost); // Send the saved post as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAllUserPosts = async (req, res) => {
  const userId = req.user._id; 

  try {
    const posts = await Post.find({ user_id: userId });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found for this user' });
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

    return res.status(200).json({ posts: responsePosts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


