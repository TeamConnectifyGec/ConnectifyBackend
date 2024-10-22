const Community = require('../../models/communityModel');
const UserCommunity = require('../../models/userCommunityModel');
const mongoose = require('mongoose');

exports.getUserCommunities = async (req, res) => {
    try {
      const user_id = req.user._id; // Assuming user id comes from authentication middleware
  
      // Find all communities the user has joined
      const userCommunities = await UserCommunity.find({ user_id }).populate('community_id');
  
      const joinedCommunities = userCommunities.map((uc) => uc.community_id);
  
      res.status(200).json(joinedCommunities);
    } catch (error) {
      console.error(`Error fetching joined communities: ${error.message}`);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

exports.getUserJoinedCommunitiesCount = async (req, res) => {
    try {
      const user_id = req.user._id; // Assuming user id comes from authentication middleware
  
      // Count the number of communities the user has joined
      const joinedCommunityCount = await UserCommunity.countDocuments({ user_id });
  
      res.status(200).json({ count: joinedCommunityCount });
    } catch (error) {
      console.error(`Error fetching community count: ${error.message}`);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Controller for a user to join a community
exports.joinCommunity = async (req, res) => {
  try {
    const user_id = req.user._id; // Assuming user ID is coming from authentication middleware
    const { community_id } = req.body; // Community ID passed in the request body

    if (!community_id) {
      return res.status(400).json({ message: 'Community ID is required' });
    }

    // Check if the community exists
    const community = await Community.findById(community_id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the user is already a member of the community
    const isAlreadyJoined = await UserCommunity.exists({ user_id: user_id, community_id: community_id });

    if (isAlreadyJoined) {
      return res.status(400).json({ message: 'User is already a member of this community' });
    }

    // Create a new user-community relation (join community)
    const userCommunity = new UserCommunity({
      user_id: user_id,
      community_id: community_id,
    });

    await userCommunity.save();

    res.status(201).json({ message: 'Successfully joined the community' });
  } catch (error) {
    console.error(`Error joining community: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

