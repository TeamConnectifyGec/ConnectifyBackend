const path = require('path');
const UV_User = require('../models/unverifiedUserModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.emailVerification = async (req, res) => {
    const { token } = req.query;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("token: "+ token)
        console.log("decodede.id: "+ decoded.id );

        // Find the unverified user by ID from the decoded token
        const uv_user = await UV_User.findById(decoded.id);
        console.log(uv_user);

        if (!uv_user) {
            return res.status(401).sendFile(path.join(__dirname, '../public/invalidToken.html'));
        }

        // Create a new User with the unverified user's data
        const newUser = new User({
            username: uv_user.username,
            email: uv_user.email,
            password: uv_user.password,
        });

        // Save the new user and delete the unverified user
        await newUser.save();
        await UV_User.findByIdAndDelete(decoded.id);

        // Send the HTML file upon successful verification
        res.status(200).sendFile(path.join(__dirname, '../public/emailVerified.html'));

    } catch (error) {
        res.status(400).sendFile(path.join(__dirname, '../public/emailNotVerified.html'));
    }
};
