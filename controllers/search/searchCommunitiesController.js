const Community = require('../../models/communityModel');
const UserCommunity = require('../../models/userCommunityModel');
const mongoose = require('mongoose');

// Controller to search communities and check if the user has joined them
exports.searchCommunities = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const user_id = req.user._id; // Assuming user id comes from authentication middleware

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Find communities that match the search term (case-insensitive)
    const communities = await Community.find({
      community_name: { $regex: searchTerm, $options: 'i' }
    });

    // Map communities and check if the user has joined each community
    const communityList = await Promise.all(communities.map(async (community) => {
      const isJoined = await UserCommunity.exists({ user_id: user_id, community_id: community._id });
      return {
        community,
        isJoined: !!isJoined,  // Boolean value indicating if the user has joined or not
      };
    }));

    res.status(200).json(communityList);
  } catch (error) {
    console.error(`Error searching communities: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

