const mongoose = require('mongoose');

const tourismOrderSchema = new mongoose.Schema(
  {
    patientEmail: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    serviceType: { type: String, required: true }, // e.g. 'Medical Visa Invitation Letter', 'Language Interpreter', 'Serviced Recovery Suite', 'Airport Pickup'
    serviceDetails: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    preferredDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourismOrder', tourismOrderSchema);
