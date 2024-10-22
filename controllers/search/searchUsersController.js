const User = require('../../models/userModel');  // Assuming the User model is in the models folder

exports.searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.body; // Get search term from query parameter

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Perform a case-insensitive search for users where the username or name matches the search term
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search on username
        { name: { $regex: searchTerm, $options: 'i' } }       // Case-insensitive search on name
      ]
    }).select('username name email pfp_link bio');  // Select the fields to return

    // If no users are found, return a message
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the array of user details
    res.json(users);

  } catch (error) {
    console.error(`Error during search: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
