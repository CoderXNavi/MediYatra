const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      index: true
    },
    hospitalType: {
      type: String,
      default: 'Multi-Specialty Medical Center',
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
    pincode: {
      type: String,
      default: null,
      trim: true
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    contactEmail: {
      type: String,
      default: 'international@mediyatra.org',
      trim: true,
      lowercase: true
    },
    contactPhone: {
      type: String,
      default: '+91-11-40008888',
      trim: true
    },
    officialWebsite: {
      type: String,
      default: null,
      trim: true
    },
    specialties: {
      type: [String],
      required: [true, 'At least one specialty is required'],
      index: true
    },
    keyCentersOfExcellence: {
      type: [String],
      default: []
    },
    facilities: {
      type: [String],
      default: []
    },
    beds: {
      type: Number,
      default: null
    },
    establishedYear: {
      type: Number,
      default: null
    },
    accreditation: {
      type: [String],
      default: ['JCI Accredited', 'NABH Accredited']
    },
    rating: {
      type: Number,
      default: null,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    ratingSource: {
      type: String,
      default: null
    },
    ratingLastVerified: {
      type: Date,
      default: null
    },
    emergencyAvailable: {
      type: Boolean,
      default: true
    },
    internationalPatientServices: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800'
    },
    description: {
      type: String,
      default: 'Accredited medical center providing tertiary & quaternary healthcare services.'
    },
    sourceUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Flexible text index
hospitalSchema.index({ name: 'text', city: 'text', specialties: 'text', state: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
