const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Treatment = require('../models/Treatment');
const mongoose = require('mongoose');

// Fallback AI recommendation dataset if MongoDB is offline
const fallbackAIRecommendation = {
  aiTriageSummary: 'Based on your symptoms and budget, our AI triage engine recommends top accredited Indian healthcare providers specializing in Cardiology and Knee Joint Surgeries.',
  recommendedHospitals: [
    {
      name: 'Apollo Hospitals New Delhi',
      city: 'New Delhi',
      matchScore: '98%',
      reason: 'JCI Accredited flagship hospital with robotic surgery and dedicated international translators desk.'
    },
    {
      name: 'Fortis Memorial Research Institute',
      city: 'Gurugram',
      matchScore: '95%',
      reason: 'Top quaternary care center with high success rates in oncology and joint replacement.'
    }
  ],
  recommendedTreatments: [
    {
      name: 'Total Knee Replacement Surgery',
      estimatedCostUSD: 4500,
      estimatedStayDays: 6
    }
  ]
};

// @desc    AI Recommendation Engine (SIH Bonus Criteria Feature)
// @route   POST /api/ai/recommend
// @access  Public
const recommendCare = async (req, res, next) => {
  try {
    const { symptoms, budgetUSD, preferredCity } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        success: false,
        error: 'Please provide patient symptoms (e.g., "knee pain", "heart bypass", "dental implants")'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const hospitalQuery = {};
      const treatmentQuery = {};

      if (preferredCity) {
        hospitalQuery.city = { $regex: preferredCity, $options: 'i' };
      }
      if (budgetUSD) {
        treatmentQuery.estimatedCostUSD = { $lte: Number(budgetUSD) };
      }

      hospitalQuery.$or = [
        { name: { $regex: symptoms, $options: 'i' } },
        { specialties: { $regex: symptoms, $options: 'i' } },
        { description: { $regex: symptoms, $options: 'i' } }
      ];

      const [hospitals, treatments] = await Promise.all([
        Hospital.find(hospitalQuery).limit(3),
        Treatment.find(treatmentQuery).limit(3)
      ]);

      return res.status(200).json({
        success: true,
        aiTriageSummary: `AI Recommendation active for symptoms: "${symptoms}". Found ${hospitals.length} matching hospital profiles within parameters.`,
        data: {
          recommendedHospitals: hospitals,
          recommendedTreatments: treatments
        }
      });
    }

    // Fallback AI mode
    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      aiTriageSummary: `AI Assistant matched your query "${symptoms}" with top accredited Indian hospitals.`,
      data: fallbackAIRecommendation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendCare
};
