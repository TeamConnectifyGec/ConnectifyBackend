const express = require('express');
const router = express.Router();
const Connection = require('../../models/connectionsModel');
const User = require('../../models/userModel');

// Controller to get pending connection requests
exports.connectionRequestController = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find all pending connections where the current user is either user1 or user2
    const pendingConnections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'pending',
    }).populate('user1 user2', 'name email username pfp_link'); // Populate user details

    // Create an array to hold the pending requests with additional field for direction
    const pendingRequests = pendingConnections.map(connection => {
      let direction;
      let otherUser;
      
      if (connection.user1._id.toString() === userId.toString()) {
        direction = 'outgoing';
        otherUser = connection.user2;
      } else {
        direction = 'incoming';
        otherUser = connection.user1;
      }

      return {
        _id: connection._id,
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          username: otherUser.username,
          pfp_link: otherUser.pfp_link,
        },
        direction,
        status: connection.status,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt
      };
    });

    return res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending connections:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = router;
