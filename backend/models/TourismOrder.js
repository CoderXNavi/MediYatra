const mongoose = require('mongoose');

const tourismOrderSchema = new mongoose.Schema(
  {
    patientEmail: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, default: '' },
    patientCountry: { type: String, default: 'International' },
    serviceType: { type: String, required: true }, // 'Medical Visa Invitation Letter', 'Language Interpreter', 'Serviced Recovery Suite', 'Airport Pickup'
    serviceDetails: { type: String, default: '' },
    hospitalId: { type: String, default: '' },
    hospitalName: { type: String, default: 'Max Super Speciality Hospital Saket' },
    doctorId: { type: String, default: '' },
    doctorName: { type: String, default: 'Dr. Naresh Trehan' },
    medicalReason: { type: String, default: 'Pre-Surgical Cardiac & General Evaluation' },
    status: {
      type: String,
      enum: ['Pending Hospital Approval', 'Approved by Hospital', 'Dispatched by Admin', 'Completed', 'Cancelled'],
      default: 'Pending Hospital Approval'
    },
    hospitalNotes: { type: String, default: '' },
    adminLogisticsNotes: { type: String, default: '' },
    doctorNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourismOrder', tourismOrderSchema);
