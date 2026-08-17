const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    specialties: {
      type: [String],
      required: [true, 'At least one specialty is required'],
      index: true
    },
    facilities: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Hospital image URL is required']
    },
    description: {
      type: String,
      required: [true, 'Hospital description is required']
    }
  },
  {
    timestamps: true
  }
);

// Search text index for flexible searching
hospitalSchema.index({ name: 'text', city: 'text', specialties: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
