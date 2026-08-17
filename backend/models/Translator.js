const mongoose = require('mongoose');

const translatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    languagesSpoken: {
      type: [String],
      required: true // e.g. ["Arabic", "French", "Russian", "Swahili", "Persian"]
    },
    specialization: {
      type: String,
      default: 'Medical Terminology Interpreter'
    },
    ratePerDayUSD: {
      type: Number,
      required: true
    },
    availableInCities: [String],
    isCertified: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Translator', translatorSchema);
