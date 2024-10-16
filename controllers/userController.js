const User = require("../models/userModel"); // Assuming the User model is in the models directory
const upload = require("../config/cloudinaryConfig"); // Import Cloudinary middleware
const cloudinary = require("cloudinary");

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields based on what's in the request
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;

      // Handle profile picture update if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.pfp_link = result.secure_url;
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
