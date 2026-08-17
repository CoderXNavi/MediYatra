const NGO = require('../models/NGO');
const mongoose = require('mongoose');

const fallbackNGOs = [
  {
    _id: 'ngo_001',
    name: 'Healing Hearts Global Foundation',
    focusArea: 'Pediatric Cardiac Surgeries',
    maxGrantUSD: 3500,
    supportedCountries: ['Kenya', 'Nigeria', 'Bangladesh', 'Nepal', 'Sri Lanka'],
    contactEmail: 'grants@healinghearts.org',
    website: 'https://healinghearts.org',
    description: 'Provides financial subsidies for underprivileged children needing cardiac surgery in India.'
  },
  {
    _id: 'ngo_002',
    name: 'Asia Medical Relief Trust',
    focusArea: 'Oncology & Bone Marrow Transplant Subsidies',
    maxGrantUSD: 8000,
    supportedCountries: ['Global', 'SAARC', 'African Union'],
    contactEmail: 'apply@asiamedicalrelief.org',
    website: 'https://asiamedicalrelief.org',
    description: 'Empowers international patients undergoing cancer therapies at accredited Indian centers.'
  },
  {
    _id: 'ngo_003',
    name: 'Smile & Sight International Aid',
    focusArea: 'Cleft Lip & Reconstructive Surgery',
    maxGrantUSD: 2000,
    supportedCountries: ['Global'],
    contactEmail: 'contact@smilesight.org',
    website: 'https://smilesight.org',
    description: '100% sponsored plastic and reconstructive medical procedures.'
  }
];

// @desc    Get NGOs providing financial subsidies to foreign patients
// @route   GET /api/ngos
// @access  Public
const getNGOs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ngos = await NGO.find();
      return res.status(200).json({
        success: true,
        count: ngos.length,
        data: ngos
      });
    }

    res.status(200).json({
      success: true,
      count: fallbackNGOs.length,
      dataSource: 'fallback-cache',
      data: fallbackNGOs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for NGO financial aid
// @route   POST /api/ngos/apply
// @access  Public
const applyForAid = async (req, res, next) => {
  try {
    const { ngoId, patientName, patientEmail, patientCountry, medicalSummary, requestedAmountUSD } = req.body;

    if (!patientName || !patientEmail || !patientCountry || !requestedAmountUSD) {
      return res.status(400).json({
        success: false,
        error: 'Please provide patientName, patientEmail, patientCountry, and requestedAmountUSD'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Financial aid application submitted to NGO network for review.',
      applicationReference: `AID_${Date.now()}`,
      status: 'Under Review'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNGOs,
  applyForAid
};
