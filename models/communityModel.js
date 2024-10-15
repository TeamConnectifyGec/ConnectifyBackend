const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    community_name: {
      type: String,
      required: true,
      unique: true, 
    },
    description: {
      type: String,
      required: true, 
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    created_on: {
      type: Date,
      default: Date.now, 
    },
    member_count: {
      type: Number,
      default: 0, 
    },
  },
  {
    timestamps: true, 
  }
);

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
