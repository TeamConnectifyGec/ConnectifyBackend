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
      <p>Please verify your email address by clicking the link below:</p>
      <a href="https::${process.env.SERVER_BASE_LINK}/auth/verify-email?token=${token}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
