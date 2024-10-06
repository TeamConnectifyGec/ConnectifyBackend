const User = require('../models/userModel');
const generateVerificationToken = require('../utils/generateVerificationToken');
const sendForgotPasswordEmail = require('../utils/sendForgotPasswordEmail');

exports.forgotPassword = async (req, res) => {
    const { email }= req.body;
    
    try {
        const userExists = await User.findOne({email});

        if(!userExists){
            return res.status(404).json({message: 'Email not found'});
        }

        const token = await generateVerificationToken(userExists._id);
        await sendForgotPasswordEmail({
            username: userExists.username,
            email: userExists.email
          },token);

        return res.status(200).json({message: `Verification email sent to ${userExists.email}`});

    } catch(error) {
        return res.status(500).json({ message: error.message });
    } 
};

