const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    nearHospital: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    distanceKm: {
      type: Number,
      required: true
    },
    pricePerNightUSD: {
      type: Number,
      required: true
    },
    amenities: [String],
    isWheelchairAccessible: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
