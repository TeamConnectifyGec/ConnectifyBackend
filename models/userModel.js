const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  // If the user is new, hash the password
  if (this.isNew) {
    try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ email: this.email });

      if (existingUser) {
        // If the user already exists, return an error
        return next();
      } else {
        // If the user is new, hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (error) {
      return next(error);
    }
  }

  // Proceed to save the user
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
