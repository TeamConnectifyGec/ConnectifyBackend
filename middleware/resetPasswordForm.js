const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.resetPasswordForm = async (req,res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Token is required');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).send('Invalid token or token expired');
        }

        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                }
                .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
                }
                .form-group {
                margin-bottom: 15px;
                }
                .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                }
                .form-group input {
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                }
                .form-group button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                border: none;
                cursor: pointer;
                border-radius: 4px;
                width: 100%;
                font-size: 16px;
                }
                .form-group button:hover {
                background-color: #45a049;
                }
                .error {
                color: red;
                margin-top: 10px;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h2>Reset Password</h2>
                <form action="/api/password/reset-password" method="POST">
                <input type="hidden" name="token" value="${token}" />
                <div class="form-group">
                    <label for="password">New Password:</label>
                    <input type="password" name="password" required />
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password:</label>
                    <input type="password" name="confirmPassword" required />
                </div>
                <div class="form-group">
                    <button type="submit">Reset Password</button>
                </div>
                <div class="error" id="error"></div>
                </form>
            </div>
            </body>
            </html>

        `,);

    } catch( error ) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).send('Invalid token');
        } else {
            console.log(token)
            return res.status(400).send('Token verification error');
        }
    }

};

