const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
      min: 0,
      max: 5
    },
    lat: {
      type: Double,
      require: true,
    },
    long: {
      type: Double,
      require: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pin', PinSchema)