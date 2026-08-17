const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
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
    medications: [
      {
        medicineName: { type: String, required: true }, // e.g. "Amoxicillin 500mg", "Paracetamol 650mg"
        dosage: { type: String, required: true },       // e.g. "1 tablet"
        frequency: { type: String, required: true },    // e.g. "Twice daily after meals"
        durationDays: { type: Number, required: true }, // e.g. 7 days
        specialInstructions: { type: String, default: '' }
      }
    ],
    nextFollowUpDate: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
