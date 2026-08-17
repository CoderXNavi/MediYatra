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
      trim: true
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
      index: true
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative']
    },
    languages: {
      type: [String],
      required: [true, 'Spoken languages are required'],
      default: ['English', 'Hindi']
    },
    consultationFeeUSD: {
      type: Number,
      required: [true, 'Consultation fee in USD is required'],
      min: [0, 'Fee cannot be negative']
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.index({ name: 'text', specialty: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
