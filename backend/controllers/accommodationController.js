const Accommodation = require('../models/Accommodation');
const mongoose = require('mongoose');

const fallbackAccommodations = [
  {
    _id: 'acc_001',
    name: 'MediStay Recovery Suites & Service Apartments',
    nearHospital: 'Apollo Hospitals New Delhi / Saket',
    city: 'New Delhi',
    distanceKm: 0.8,
    pricePerNightUSD: 35,
    amenities: ['Wheelchair Accessible', 'Custom Halal & Soft Diet Menu', '24/7 On-call Nurse', 'Kitchenette'],
    isWheelchairAccessible: true
  },
  {
    _id: 'acc_002',
    name: 'Fortis Companion Care Residency',
    nearHospital: 'Fortis Memorial Research Institute',
    city: 'Gurugram',
    distanceKm: 0.5,
    pricePerNightUSD: 40,
    amenities: ['Airport Transfer Shuttle', 'High-Speed WiFi', 'Elevator', 'In-house Pharmacy Partner'],
    isWheelchairAccessible: true
  },
  {
    _id: 'acc_003',
    name: 'Gujarat International Patient Residency',
    nearHospital: 'Apollo Hospitals International Ltd.',
    city: 'Ahmedabad',
    distanceKm: 1.2,
    pricePerNightUSD: 28,
    amenities: ['Wheelchair Accessible', 'Medical Oxygen Cylinder Desk', 'Laundry Service'],
    isWheelchairAccessible: true
  }
];

// @desc    Get medical accommodations near target hospitals
// @route   GET /api/accommodations
// @access  Public
const getAccommodations = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (city) query.city = { $regex: city, $options: 'i' };

      const accommodations = await Accommodation.find(query);
      return res.status(200).json({
        success: true,
        count: accommodations.length,
        data: accommodations
      });
    }

    let filtered = [...fallbackAccommodations];
    if (city) {
      filtered = filtered.filter((a) => a.city.toLowerCase().includes(city.toLowerCase()));
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
  getAccommodations
};
