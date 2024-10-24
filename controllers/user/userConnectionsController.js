const express = require('express');
const router = express.Router();
const Connection = require('../../models/connectionsModel');
const User = require('../../models/userModel');

// Route to add a new connection
exports.addConnection =  async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ message: 'Both user1 and user2 are required' });
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
  const userId  = req.user._id;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all connections where user1 or user2 is the given userId and status is accepted
    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'accepted',
    }).populate('user1 user2', 'name email'); // Optionally populate user details

    return res.status(200).json({ connections });
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

