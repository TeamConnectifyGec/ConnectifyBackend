const User = require("../../models/userModel"); // Assuming the User model is in the models directory
const {cloudinary }= require('../../config/cloudinaryConfig')

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update user fields based on the request
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;

      if (req.file) {
        // Extract the public_id from the current pfp_link if it exists
        const currentPfpPublicId = user.pfp_link
          ? user.pfp_link.split('/').pop().split('.')[0] // Get public_id from the URL
          : null;

        console.log(req.file);

        // Set the new image URL to the user's profile
        user.pfp_link = req.file.path; // Cloudinary path set by multer

        // If there is an old profile picture, delete it from Cloudinary
        if (currentPfpPublicId && currentPfpPublicId !== 'default-profile') {
          await cloudinary.uploader.destroy(currentPfpPublicId);
        }
      }
      const updatedUser = await user.save();
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
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
