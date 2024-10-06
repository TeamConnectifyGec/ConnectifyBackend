require('dotenv').config();
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const passwordRouter = require('./routes/password');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/password', passwordRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
