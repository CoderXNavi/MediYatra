const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Associated hospital ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Treatment name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    estimatedCostUSD: {
      type: Number,
      required: [true, 'Estimated cost in USD is required'],
      min: [0, 'Cost cannot be negative']
    },
    estimatedCostINR: {
      type: Number,
      required: [true, 'Estimated cost in INR is required'],
      min: [0, 'Cost cannot be negative']
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    procedureOverview: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

treatmentSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Treatment', treatmentSchema);
