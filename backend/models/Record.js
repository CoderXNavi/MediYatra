const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true
    },
    patientEmail: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      enum: ['MRI Scan', 'CT Scan', 'X-Ray Report', 'Blood Test', 'Doctor Referral Letter'],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
