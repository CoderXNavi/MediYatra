const Translator = require('../models/Translator');
const mongoose = require('mongoose');

const fallbackTranslators = [
  {
    _id: 'trans_001',
    name: 'Tariq Al-Mansoor',
    languagesSpoken: ['Arabic', 'English', 'Hindi'],
    specialization: 'Cardiology & Transplant Medical Interpreter',
    ratePerDayUSD: 40,
    availableInCities: ['New Delhi', 'Ahmedabad', 'Navi Mumbai', 'Gurugram'],
    isCertified: true
  },
  {
    _id: 'trans_002',
    name: 'Elena Rostova',
    languagesSpoken: ['Russian', 'English'],
    specialization: 'Oncology & Surgical Terminology Interpreter',
    ratePerDayUSD: 45,
    availableInCities: ['New Delhi', 'Navi Mumbai', 'Bengaluru'],
    isCertified: true
  },
  {
    _id: 'trans_003',
    name: 'Jean-Pierre Kabore',
    languagesSpoken: ['French', 'Swahili', 'English'],
    specialization: 'General Healthcare & Orthopedics Interpreter',
    ratePerDayUSD: 35,
    availableInCities: ['New Delhi', 'Ahmedabad', 'Bathinda'],
    isCertified: true
  }
];

// @desc    Get medical translators by language or city
// @route   GET /api/translators
// @access  Public
const getTranslators = async (req, res, next) => {
  try {
    const { language, city } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (language) query.languagesSpoken = { $regex: language, $options: 'i' };
      if (city) query.availableInCities = { $regex: city, $options: 'i' };

      const translators = await Translator.find(query);
      return res.status(200).json({
        success: true,
        count: translators.length,
        data: translators
      });
    }

    let filtered = [...fallbackTranslators];
    if (language) {
      filtered = filtered.filter((t) => t.languagesSpoken.some((l) => l.toLowerCase().includes(language.toLowerCase())));
    }
    if (city) {
      filtered = filtered.filter((t) => t.availableInCities.some((c) => c.toLowerCase().includes(city.toLowerCase())));
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
  getTranslators
};
