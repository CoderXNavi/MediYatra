const mongoose = require('mongoose');

const aidRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true
    },
    patientEmail: {
      type: String,
      required: true
    },
    patientPhone: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: 'New Delhi'
    },
    requestedCategory: {
      type: String,
      enum: ['Medicines', 'Wheelchairs', 'Oxygen Cylinders', 'Medical Equipment', 'Hospital Subsidy'],
      default: 'Medicines'
    },
    requestedItemName: {
      type: String,
      required: true
    },
    medicalReason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending NGO Review', 'Approved', 'Dispatched', 'Completed', 'Rejected'],
      default: 'Pending NGO Review'
    },
    ngoNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AidRequest', aidRequestSchema);
