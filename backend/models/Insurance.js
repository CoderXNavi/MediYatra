const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    coverageUSD: {
      type: Number,
      required: true
    },
    medicalVisaAssistanceIncluded: {
      type: Boolean,
      default: true
    },
    premiumPerDayUSD: {
      type: Number,
      required: true
    },
    features: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Insurance', insuranceSchema);
