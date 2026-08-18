const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Associated hospital ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      index: true
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
      index: true
    },
    department: {
      type: String,
      default: null,
      trim: true
    },
    subSpecialty: {
      type: String,
      default: null,
      trim: true
    },
    designation: {
      type: String,
      default: 'Senior Specialist',
      trim: true
    },
    qualifications: {
      type: String,
      default: 'Not publicly available',
      trim: true
    },
    experienceYears: {
      type: Number,
      default: null
    },
    languages: {
      type: [String],
      default: []
    },
    consultationFeeUSD: {
      type: Number,
      default: null
    },
    consultationFeeINR: {
      type: Number,
      default: null
    },
    opdFee: {
      type: Number,
      default: null
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    biography: {
      type: String,
      default: null
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

doctorSchema.index({ name: 'text', specialty: 'text', department: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
