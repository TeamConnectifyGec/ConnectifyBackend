const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
      ref: 'User',
      required: true,
    },
    post_title: {
      type: String,
      required: true,
    },
    post_content: {
      type: String,
      default: '',
    },
    post_points: {
      type: Number,
      default: 0,  
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],  // Post visibility options
      default: 'public',
    },
    community_id: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the community where the post was made
      ref: 'Community',
    },
    post_image_link: {
      type: String,  // Store URL to the post image if there is one
      default: null,  // Default to null if no image is provided
    },
    post_hashes: {
      type: [],
    },
  },
  {
    timestamps: true,  
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
