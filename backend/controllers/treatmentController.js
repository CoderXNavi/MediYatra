const Treatment = require('../models/Treatment');
const mongoose = require('mongoose');

const fallbackTreatments = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d9',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Coronary Artery Bypass Grafting (CABG)',
    category: 'Cardiology',
    estimatedCostUSD: 5200,
    estimatedCostINR: 430000,
    durationDays: 8,
    description: 'Advanced open-heart bypass procedure using minimally invasive techniques.',
    procedureOverview: 'Includes preoperative assessment, ICU stay, and post-op rehabilitation.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0da',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Total Knee Replacement Surgery',
    category: 'Orthopedics',
    estimatedCostUSD: 4500,
    estimatedCostINR: 375000,
    durationDays: 6,
    description: 'Implant surgery replacing damaged knee joint cartilage with high-grade metal prosthetic.',
    procedureOverview: 'Includes computer-assisted navigation and 5 days hospital recovery.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0db',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Bone Marrow Transplant (BMT)',
    category: 'Oncology',
    estimatedCostUSD: 18000,
    estimatedCostINR: 1500000,
    durationDays: 21,
    description: 'Autologous or allogeneic stem cell transplant for leukemia and blood disorders.',
    procedureOverview: 'Includes high-efficiency particulate air (HEPA) filtered isolation room.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0dc',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Full Mouth Dental Implants',
    category: 'Dental Care',
    estimatedCostUSD: 2800,
    estimatedCostINR: 230000,
    durationDays: 4,
    description: 'Titanium root replacement for missing teeth with custom porcelain crowns.',
    procedureOverview: '3D imaging guided placement with immediate loading options.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0dd',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d4',
    name: 'In-Vitro Fertilization (IVF) Package',
    category: 'Fertility Care',
    estimatedCostUSD: 3200,
    estimatedCostINR: 265000,
    durationDays: 14,
    description: 'Complete assisted reproduction cycle including hormone stimulation and ICSI.',
    procedureOverview: 'Embryo monitoring in cleanroom laboratory conditions.'
  }
];

// @desc    Get all treatments with optional filtering (category, hospitalId, search, maxCost)
// @route   GET /api/treatments
// @access  Public
const getTreatments = async (req, res, next) => {
  try {
    const { category, hospitalId, search, maxCost } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }
      if (hospitalId) {
        query.hospitalId = hospitalId;
      }
      if (maxCost) {
        query.estimatedCostUSD = { $lte: Number(maxCost) };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const treatments = await Treatment.find(query).populate('hospitalId', 'name city rating').sort({ estimatedCostUSD: 1 });

      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments
      });
    }

    // Fallback mode
    let filtered = [...fallbackTreatments];
    if (category) {
      filtered = filtered.filter((t) => t.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (hospitalId) {
      filtered = filtered.filter((t) => t.hospitalId === hospitalId);
    }
    if (maxCost) {
      filtered = filtered.filter((t) => t.estimatedCostUSD <= Number(maxCost));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
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

// @desc    Get single treatment by ID
// @route   GET /api/treatments/:id
// @access  Public
const getTreatmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const treatment = await Treatment.findById(id).populate('hospitalId');
      if (!treatment) {
        return res.status(404).json({
          success: false,
          error: `Treatment not found with id of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: treatment
      });
    }

    const treatment = fallbackTreatments.find((t) => t._id === id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        error: `Treatment not found with id of ${id}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: treatment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get treatments by Hospital ID
// @route   GET /api/hospitals/:hospitalId/treatments
// @access  Public
const getTreatmentsByHospital = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const treatments = await Treatment.find({ hospitalId }).sort({ estimatedCostUSD: 1 });
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments
      });
    }

    const filtered = fallbackTreatments.filter((t) => t.hospitalId === hospitalId);
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

// @desc    Create new treatment profile
// @route   POST /api/treatments
// @access  Public / Admin
const createTreatment = async (req, res, next) => {
  try {
    const {
      hospitalId,
      name,
      category,
      estimatedCostUSD,
      estimatedCostINR,
      durationDays,
      description,
      procedureOverview
    } = req.body;

    if (!hospitalId || !name || !category || !estimatedCostUSD || !estimatedCostINR || !durationDays || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide mandatory fields: hospitalId, name, category, estimatedCostUSD, estimatedCostINR, durationDays, description'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const treatment = await Treatment.create({
        hospitalId,
        name,
        category,
        estimatedCostUSD,
        estimatedCostINR,
        durationDays,
        description,
        procedureOverview: procedureOverview || ''
      });

      return res.status(201).json({
        success: true,
        data: treatment
      });
    }

    const newTreatment = {
      _id: `treat_${Date.now()}`,
      hospitalId,
      name,
      category,
      estimatedCostUSD,
      estimatedCostINR,
      durationDays,
      description,
      procedureOverview: procedureOverview || ''
    };
    fallbackTreatments.unshift(newTreatment);

    res.status(201).json({
      success: true,
      dataSource: 'fallback-cache',
      data: newTreatment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTreatments,
  getTreatmentById,
  getTreatmentsByHospital,
  createTreatment
};
