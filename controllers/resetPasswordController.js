const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  // Validate input data
  if (!token || !password) {
      return res.status(400).send('Token and new password are required');
  }

  try {
      // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user.password = password;

    // Save user and check for errors
    await user.save();

    res.status(200).send('Password has been reset successfully');
    } catch (error) {

        // Handle specific token errors
        if (error.name === 'TokenExpiredError') {
            res.status(401).send('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).send('Invalid token');
        } else {
            res.status(500).send('An error occurred while resetting the password');
        }
    }
};

