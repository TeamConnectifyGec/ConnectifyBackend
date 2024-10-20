const Post = require('../models/postModel');
const cloudinary = require('../config/cloudinaryConfig');

exports.createPost = async (req, res) => {
  try {
    const { post_title, visibility, community_id, post_hashes } = req.body;
    const userId = req.user._id;

    // Ensure required fields are provided
    if (!post_title) {
      return res.status(400).json({ message: 'Post title is required' });
    }

    // Initialize the post object with required fields
    let newPost = new Post({
      user_id: userId,
      post_title,
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