const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      min: 4
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true,
      min: 6
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema)