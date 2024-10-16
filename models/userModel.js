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
    name: {
      type: String,
      //required: true
    },
    pfp_link: {
      type: String,  
      default: 'default-profile.png' ,
    },
    bio: {
      type: String,  
    },
    created_on: {
      type: Date,
      default: Date.now  
    }
  },
  {
    timestamps: true,  
  }
);

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving if the password was modified
userSchema.pre('save', async function (next) {
  // if (!this.isModified('password')) {
  //   next();
  // }

  // try {
  //   const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(this.password, salt);
  //   next();
  // } catch (error) {
  //   return next(error);
  // }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
