const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');


exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create a new user if both username and email are unique
    const user = new User({ username, email, password });
    await user.save();

    // Respond with the new user's details and token
    res.status(201).json({
      userid: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log(user);

    if (user && (await user.matchPassword(password))) {
      res.json({
        userid: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
