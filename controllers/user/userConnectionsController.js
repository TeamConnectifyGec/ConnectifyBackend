const express = require('express');
const router = express.Router();
const Connection = require('../../models/connectionsModel');
const User = require('../../models/userModel');

// Route to add a new connection
exports.addConnection =  async (req, res) => {
  const user1 = req.user._id; // Get user1 from auth middleware
  const { user2 } = req.body;

  if (!user2) {
    return res.status(400).json({ message: 'User2 is required' });
  }

  try {
    // Check if both users exist
    const userOneExists = await User.findById(user1);
    const userTwoExists = await User.findById(user2);

    if (!userOneExists || !userTwoExists) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 } // Check for both directions
      ]
    });

    if (existingConnection) {
      return res.status(409).json({ message: 'Connection already exists' });
    }

    // Create a new connection
    const newConnection = new Connection({ user1, user2, status: 'pending' });
    await newConnection.save();

    return res.status(201).json({ message: 'Connection request sent', connection: newConnection });
  } catch (error) {
    console.error('Error creating connection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Route to get a user's connections
exports.getConnections = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find all connections where user1 or user2 is the given userId and status is accepted
    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'accepted',
    }).populate('user1 user2', 'name email username pfp_link'); // Populate user details

    // Create an array to hold the other users' data
    const otherUsers = connections.map(connection => {
      const otherUser = connection.user1._id.toString() === userId.toString() ? connection.user2 : connection.user1;
      return {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        username: otherUser.username,
        pfp_link: otherUser.pfp_link,
      };
    });

    return res.status(200).json({ connections: otherUsers });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Route to get a user's connection count
exports.getConnectionsCount = async (req, res) => {
  const userId  = req.user._id;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count all connections where user1 or user2 is the given userId and status is accepted
    const connectionCount = await Connection.countDocuments({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'accepted',
    });

    return res.status(200).json({ count: connectionCount });
  } catch (error) {
    console.error('Error counting connections:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller to accept a connection request
exports.acceptConnection = async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.body;

  try {
    // Find the connection by ID
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Check if the current user is either user1 or user2 in the connection
    if (connection.user1.toString() !== userId.toString() && connection.user2.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to accept this connection request' });
    }

    // Update the connection status to 'accepted'
    connection.status = 'accepted';
    await connection.save();

    return res.status(200).json({ message: 'Connection request accepted', connection });
  } catch (error) {
    console.error('Error accepting connection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller to cancel a connection request
exports.cancelConnection = async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.body;

  try {
    // Find the connection by ID
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Check if the current user is either user1 or user2 in the connection
    if (connection.user1.toString() !== userId.toString() && connection.user2.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this connection request' });
    }

    // Remove the connection
    await connection.remove();

    return res.status(200).json({ message: 'Connection request canceled' });
  } catch (error) {
    console.error('Error canceling connection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const Connection = require('../../models/connectionsModel');

// Controller to reject a connection request
exports.rejectConnection = async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.body;

  try {
    // Find the connection by ID
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Check if the current user is either user1 or user2 in the connection
    if (connection.user2.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to reject this connection request' });
    }

    // Remove the connection
    await connection.remove();

    return res.status(200).json({ message: 'Connection request rejected' });
  } catch (error) {
    console.error('Error rejecting connection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
