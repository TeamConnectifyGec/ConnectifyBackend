const User = require("../models/userModel"); // Assuming the User model is in the models directory
const upload = require("../config/cloudinaryConfig"); // Import Cloudinary middleware

exports.updateUser = async (req, res) => {
  const { username, email, name, bio } = req.body;

  try {
    // If an image is uploaded, Cloudinary will handle it and we can get the image URL
    let pfp_link;
    if (req.file) {
      pfp_link = req.file.path; // Cloudinary returns the image URL in `req.file.path`
    }

    // Update user details along with the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          name,
          pfp_link: pfp_link || undefined, // If no new image, leave it unchanged
          bio,
        },
      },
      { new: true, runValidators: true } // Return the updated document
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
