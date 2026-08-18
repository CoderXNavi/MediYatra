const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    focusArea: {
      type: String,
      required: true // e.g. "Medicine Donation & Free Medical Equipment", "Pediatric Cancer Aid"
    },
    city: {
      type: String,
      default: 'New Delhi'
    },
    maxGrantUSD: {
      type: Number,
      default: 5000
    },
    supportedCountries: {
      type: [String],
      default: ['Global', 'India', 'SAARC', 'Africa']
    },
    contactEmail: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: '+91 11 4000 9999'
    },
    website: {
      type: String,
      default: 'https://mediyatra.org/charity'
    },
    description: {
      type: String,
      required: true
    },
    isVerifiedByAdmin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NGO', ngoSchema);
