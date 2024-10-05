const nodemailer = require('nodemailer');

const sendVerificationEmail = async (user, token) => {
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
    subject: 'Verify your email address',
    html: `
      <h2>Hello ${user.username}</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="https://${process.env.SERVER_BASE_LINK}/auth/email-verify?token=${token}" style="text-decoration: none;">
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
          Verify Email
        </button>
      </a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
