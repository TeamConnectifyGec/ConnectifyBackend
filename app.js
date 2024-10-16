require('dotenv').config();
const express = require('express');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const connectDB = require('./config/db');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const passwordRouter = require('./routes/password');
const userRouter = require('./routes/user');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// app.use('/api', (req, res, next) => {
//   if (req.path.startsWith('/auth') || req.path.startsWith('/password')) {
//     return next();
//   }
//   return authMiddleware(req, res, next);
// });

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/password', passwordRouter);
app.use('/api/user',userRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
