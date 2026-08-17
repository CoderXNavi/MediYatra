const Insurance = require('../models/Insurance');
const mongoose = require('mongoose');

const fallbackInsurancePlans = [
  {
    _id: 'ins_001',
    planName: 'MediYatra Global Health Guard',
    provider: 'Religare International Medical Care',
    coverageUSD: 50000,
    medicalVisaAssistanceIncluded: true,
    premiumPerDayUSD: 4.5,
    features: ['Emergency Air Ambulance Cover', 'Pre-Existing Emergency Cover', 'Fast-Track e-Medical Visa Invitation Letter', 'Translator Assistance']
  },
  {
    _id: 'ins_002',
    planName: 'Premier Travel Care India',
    provider: 'Tata AIG Global Assistance',
    coverageUSD: 100000,
    medicalVisaAssistanceIncluded: true,
    premiumPerDayUSD: 7.2,
    features: ['100% Hospitalization Cover', 'Companion Travel & Stay Allowance', '24/7 Multilingual Claim Helpline', 'Post-Op Repatriation']
  }
];

// @desc    Get medical travel insurance plans
// @route   GET /api/insurance
// @access  Public
const getInsurancePlans = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const plans = await Insurance.find();
      return res.status(200).json({
        success: true,
        count: plans.length,
        data: plans
      });
    }

    res.status(200).json({
      success: true,
      count: fallbackInsurancePlans.length,
      dataSource: 'fallback-cache',
      data: fallbackInsurancePlans
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsurancePlans
};
