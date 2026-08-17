const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: false
    },
    serviceProvider: {
      type: String,
      required: [true, 'Service provider name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    vehicleType: {
      type: String,
      enum: ['Advanced Life Support (ALS)', 'Basic Life Support (BLS)', 'Air Ambulance', 'Airport Medical Shuttle'],
      required: true
    },
    airportPickupAvailable: {
      type: Boolean,
      default: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    pricePerKmUSD: {
      type: Number,
      default: 2.5
    },
    is24x7: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ambulance', ambulanceSchema);
