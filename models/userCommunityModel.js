const mongoose = require('mongoose');

const userCommunitySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    community_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    joined_on: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Prevent duplicate entries of the same user joining the same community
userCommunitySchema.index({ user_id: 1, community_id: 1 }, { unique: true });

const UserCommunity = mongoose.model('UserCommunity', userCommunitySchema);

module.exports = UserCommunity;
