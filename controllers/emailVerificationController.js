const UV_User = require('../models/unverifiedUserModel');
const User = requier('../models/userModel');
const jwt = require('jsonwebtoken');

exports.emailVerification = async (req,res) => {
    const {token} = req.query;

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const uv_user =  UV_User.findById(decoded.id);

        if(!uv_user){
            return (res.status(400).json({message:'Invalid token'}));
        }

        const newUser = new User({
            username: uv_user.username,
            email: uv_user.email,
            password: uv_user.password,
        });
        
        UV_User.findByIdAndDelete(decoded.id);

        await newUser.save();

        res.json({ message: 'Email successfully verified!' });

    } catch (error) {
        res.status(400).json({ message: 'Verification failed or token expired' });
    }
    
};
