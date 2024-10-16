const User = require("../models/userModel"); // Assuming the User model is in the models directory
const cloudinary = require("cloudinary");

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update user fields based on the request
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;

      // If a file (profile picture) is uploaded, update the pfp_link
      if (req.file) {
        user.pfp_link = req.file.path; // Cloudinary file URL is in req.file.path
      }

      const updatedUser = await user.save();

      // Exclude the password from the response
      const userWithoutPassword = updatedUser.toObject();
      delete userWithoutPassword.password;

      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'Server error', error });
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
