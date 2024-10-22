const Post = require('../../models/postModel'); // Assuming the Post model
const User = require('../../models/userModel'); // Assuming the User model
const Connection = require('../../models/connectionsModel'); // Assuming Connection model to track user's connections

// Controller to get the feed (posts of connections and the user)
exports.getUserFeed = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available through authentication middleware

    // Fetch the user's connections where the user is either user1 or user2
    const userConnections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'accepted' // Only consider accepted connections
    });

    // Extract the IDs of the connected users
    const connectionIds = userConnections.map(connection => 
      connection.user1.toString() === userId.toString() ? connection.user2 : connection.user1
    );

    // Fetch posts from the user's connections and the user themselves
    const posts = await Post.find({
      $or: [
        { user_id: { $in: connectionIds } },  // Posts from the user's connections
        { user_id: userId }  // User's own posts
      ]
    }).sort({ createdAt: -1 });  // Assuming there's a createdAt field to sort by recent posts

    // Send the posts as the feed
    res.status(200).json({
      message: 'Feed fetched successfully',
      posts
    });
  } catch (error) {
    console.error(`Error fetching feed: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
