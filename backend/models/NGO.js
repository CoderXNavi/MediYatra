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
      required: true // e.g. "Pediatric Cardiology", "Organ Transplant Subsidy", "Cancer Aid"
    },
    maxGrantUSD: {
      type: Number,
      required: true
    },
    supportedCountries: {
      type: [String],
      default: ['Global', 'Africa', 'SAARC', 'Southeast Asia']
    },
    contactEmail: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NGO', ngoSchema);
