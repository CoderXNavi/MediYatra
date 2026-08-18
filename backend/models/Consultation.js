const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    patientEmail: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String },
    patientCountry: { type: String, default: 'United States' },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    hospitalId: { type: String },
    hospitalName: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Responded', 'Closed'],
      default: 'Pending'
    },
    doctorResponse: { type: String, default: '' },
    respondedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
