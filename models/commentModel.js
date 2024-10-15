const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    
    user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post',
    },
    comment_text: {
      type: String,
      required: true,  
    },
    created_on: {
      type: Date,
      default: Date.now,  
    }
  },
  {
    timestamps: true,  
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
