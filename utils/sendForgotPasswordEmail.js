const nodemailer = require('nodemailer');

const sendForgotPasswordEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset Your Password',
    html: `
      <h2>Hello ${user.username}</h2>
      <p>You requested to reset your password. Please click the button below to reset your password:</p>
      <a href="${process.env.SERVER_BASE_LINK}/password/reset-password?token=${token}" style="text-decoration: none;">
        <button style="
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 5px;
        ">
          Reset Password
        </button>
      </a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
 
module.exports = sendForgotPasswordEmail;
