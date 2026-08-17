const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital ID is required']
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null
    },
    treatmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment',
      default: null
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    patientEmail: {
      type: String,
      required: [true, 'Patient email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone number is required'],
      trim: true
    },
    patientCountry: {
      type: String,
      required: [true, 'Patient country is required'],
      trim: true
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred appointment date is required'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Preferred appointment date must be in the future'
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    medicalNotes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
