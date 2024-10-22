const Community = require('../models/communityModel');  // Import the Community model
const UserCommunity = require('../models/userCommunityModel');  // Import the UserCommunity model
const mongoose = require('mongoose');

// Controller to create a community
exports.createCommunity = async (req, res) => {
  try {
    const { community_name, description} = req.body;
    user_id = req.user._id;

    // Validate required fields
    if (!community_name || !description || !user_id) {
      return res.status(400).json({ message: 'Community name, description, and user ID are required' });
    }

    // Check if a community with the same name already exists
    const existingCommunity = await Community.findOne({ community_name });
    if (existingCommunity) {
      return res.status(400).json({ message: 'Community with this name already exists' });
    }

    // Create the new community
    const community = new Community({
      community_name,
      description,
      created_by: user_id,
      member_count: 1,  // Initially, the creator is the first member
    });

    // Save the community to the database
    const savedCommunity = await community.save();

    // Add the creator as the first member of the community in the UserCommunity model
    const userCommunity = new UserCommunity({
      user_id: user_id,
      community_id: savedCommunity._id,
    });

    await userCommunity.save();

    res.status(201).json({
      message: 'Community created successfully',
      community: savedCommunity,
    });
  } catch (error) {
    console.error(`Error creating community: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

