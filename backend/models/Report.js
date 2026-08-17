const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    hospitalName: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    recommendedTreatment: {
      type: String,
      required: true
    },
    estimatedStayDays: {
      type: Number,
      default: 7
    },
    estimatedCostUSD: {
      type: Number,
      required: true
    },
    visaInvitationApproved: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
