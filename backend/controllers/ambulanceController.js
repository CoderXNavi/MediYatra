const Ambulance = require('../models/Ambulance');
const mongoose = require('mongoose');

const fallbackAmbulances = [
  {
    _id: 'amb_001',
    serviceProvider: 'Apollo Air & Ground MedEvac',
    city: 'New Delhi',
    vehicleType: 'Air Ambulance',
    airportPickupAvailable: true,
    contactPhone: '+91-11-26925858',
    pricePerKmUSD: 12.0,
    is24x7: true
  },
  {
    _id: 'amb_002',
    serviceProvider: 'Fortis Advanced Life Support (ALS) Unit',
    city: 'Gurugram',
    vehicleType: 'Advanced Life Support (ALS)',
    airportPickupAvailable: true,
    contactPhone: '+91-124-4921021',
    pricePerKmUSD: 3.5,
    is24x7: true
  },
  {
    _id: 'amb_003',
    serviceProvider: 'Max Medical Express Shuttle',
    city: 'New Delhi',
    vehicleType: 'Airport Medical Shuttle',
    airportPickupAvailable: true,
    contactPhone: '+91-11-26515050',
    pricePerKmUSD: 1.8,
    is24x7: true
  }
];

// @desc    Get ambulance services with optional city filter
// @route   GET /api/ambulance
// @access  Public
const getAmbulances = async (req, res, next) => {
  try {
    const { city, vehicleType } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (city) query.city = { $regex: city, $options: 'i' };
      if (vehicleType) query.vehicleType = vehicleType;

      const ambulances = await Ambulance.find(query);
      return res.status(200).json({
        success: true,
        count: ambulances.length,
        data: ambulances
      });
    }

    let filtered = [...fallbackAmbulances];
    if (city) {
      filtered = filtered.filter((a) => a.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (vehicleType) {
      filtered = filtered.filter((a) => a.vehicleType === vehicleType);
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      dataSource: 'fallback-cache',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAmbulances
};
