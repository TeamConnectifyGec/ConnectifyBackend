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
    post_points: {
      type: Number,
      default: 0,  
    },
    created_on: {
      type: Date,
      default: Date.now, 
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
    }
  },
  {
    timestamps: true,  
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
