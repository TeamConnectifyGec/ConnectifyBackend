const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user receiving the notification
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['comment', 'like', 'follow', 'community_join', 'system'], // Different types of notifications
      required: true,
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the associated object (e.g., post or community)
      ref: 'Post', // You may want to conditionally change this based on the type
    },
    message: {
      type: String,
      required: true, // Notification message is required
    },
    created_on: {
      type: Date,
      default: Date.now, // Automatically set the notification creation date
    },
    is_read: {
      type: Boolean,
      default: false, // Default value for read status
    },
    read_at: {
      type: Date, // Timestamp for when the notification was read
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
