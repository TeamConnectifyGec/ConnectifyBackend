const User = require('../models/userModel');
const UV_User = require('../models/unverifiedUserModel');
const generateToken = require('../utils/generateToken');
const generateVerificationToken = require('../utils/generateVerificationToken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');


exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    
    const usernameExists = await User.findOne({ username });
    const emailExists = await User.findOne({ email });
    
    // check if user has been registerd 
    // basiclly we check if the user exists in the database and passwords match 
    if(usernameExists && emailExists) {
      
      const user = await User.findOne({ username });

      if (user && (await user.matchPassword(password))) {
        return res.status(201).json({
          userid: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
          message: "User registered",
        });
      }
    }

    // Check if username already exists
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    // Check if email already exists
    if (emailExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    const uv_usernameExists = await UV_User.findOne({ username });
    const uv_emailExists = await UV_User.findOne({ email });
    // Create a new un-verified user if both username and email are unique
    if (!uv_usernameExists || !uv_emailExists) {
      
      const user = new UV_User({ username, email, password });
      await user.save();

      const token = await generateVerificationToken(user._id);
    
      console.log("token in signup : " + token);

      await sendVerificationEmail({
        username: user.username,
        email: user.email
      },token);
      return res.status(200).json({
        message:`Verification email sent to ${user.email}`,
      });
    }
    
    // if the unverified user exists
    if(uv_emailExists && uv_usernameExists){

      return res.status(200).json({
        message:`Verification email sent to ${uv_usernameExists.email}`
      });
    }

    return res.status(500).json({ message: 'An unexpected error occurred' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        userid: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
