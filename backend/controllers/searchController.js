const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Treatment = require('../models/Treatment');
const mongoose = require('mongoose');

// @desc    Global Multi-Entity Search API
// @route   GET /api/search
// @access  Public
const globalSearch = async (req, res, next) => {
  try {
    const { q, city, category, maxCost } = req.query;

    if (mongoose.connection.readyState === 1) {
      let hospitalQuery = {};
      let doctorQuery = {};
      let treatmentQuery = {};

      if (q) {
        hospitalQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { city: { $regex: q, $options: 'i' } },
          { specialties: { $regex: q, $options: 'i' } }
        ];
        doctorQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { specialty: { $regex: q, $options: 'i' } }
        ];
        treatmentQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ];
      }

      if (city) {
        hospitalQuery.city = { $regex: city, $options: 'i' };
      }
      if (category) {
        treatmentQuery.category = { $regex: category, $options: 'i' };
      }
      if (maxCost) {
        treatmentQuery.estimatedCostUSD = { $lte: Number(maxCost) };
      }

      const [hospitals, doctors, treatments] = await Promise.all([
        Hospital.find(hospitalQuery).limit(10),
        Doctor.find(doctorQuery).populate('hospitalId', 'name city').limit(10),
        Treatment.find(treatmentQuery).populate('hospitalId', 'name city').limit(10)
      ]);

      return res.status(200).json({
        success: true,
        data: {
          hospitals,
          doctors,
          treatments
        }
      });
    }

    // Fallback search mode
    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: {
        hospitals: [],
        doctors: [],
        treatments: []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  globalSearch
};
