const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Medicines', 'Wheelchairs', 'Oxygen Cylinders', 'Medical Equipment', 'Hospital Beds'],
      default: 'Medical Equipment'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    city: {
      type: String,
      default: 'New Delhi'
    },
    donorName: {
      type: String,
      default: 'Anonymous Healthcare Donor'
    },
    donorEmail: {
      type: String,
      required: true
    },
    ngoPartner: {
      type: String,
      default: 'MediYatra Charitable Care Foundation'
    },
    description: {
      type: String,
      default: 'Surplus medical aid in excellent working condition.'
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Dispatched', 'Claimed'],
      default: 'Available'
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
