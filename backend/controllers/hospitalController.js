const Hospital = require('../models/Hospital');
const mongoose = require('mongoose');
const { verifiedHospitals } = require('../data/verifiedIndianHealthcareData');

// @desc    Get all hospitals with optional filtering
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res, next) => {
  try {
    const { city, specialty, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (city) query.city = { $regex: city, $options: 'i' };
      if (specialty) query.specialties = { $regex: specialty, $options: 'i' };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { specialties: { $regex: search, $options: 'i' } }
        ];
      }

      let hospitals = await Hospital.find(query).sort({ rating: -1, createdAt: -1 });

      if (hospitals.length === 0 && !city && !specialty && !search) {
        hospitals = await Hospital.insertMany(verifiedHospitals);
      }

      return res.status(200).json({
        success: true,
        count: hospitals.length,
        data: hospitals
      });
    }

    let filtered = [...verifiedHospitals];
    if (city) filtered = filtered.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    if (specialty) filtered = filtered.filter((h) => h.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase())));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      dataSource: 'verified-cache',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const hospital = await Hospital.findById(id);
      if (hospital) {
        return res.status(200).json({ success: true, data: hospital });
      }
    }

    const hospital = verifiedHospitals.find((h) => h._id === id || h.name.toLowerCase() === id.toLowerCase());
    if (!hospital) {
      return res.status(404).json({ success: false, error: `Hospital not found with id of ${id}` });
    }

    res.status(200).json({ success: true, dataSource: 'verified-cache', data: hospital });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hospital profile
// @route   POST /api/hospitals
// @access  Public / Admin
const createHospital = async (req, res, next) => {
  try {
    const {
      name,
      city,
      state,
      country,
      address,
      specialties,
      facilities,
      beds,
      rating,
      contactEmail,
      contactPhone,
      imageUrl,
      description
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide hospital name'
      });
    }

    const hospitalObj = {
      name,
      city: city || 'New Delhi',
      state: state || 'Delhi NCR',
      country: country || 'India',
      address: address || `${name}, ${city || 'New Delhi'}`,
      specialties: specialties ? (Array.isArray(specialties) ? specialties : specialties.split(',').map((s) => s.trim())) : ['Cardiology', 'Orthopaedics', 'Oncology', 'Organ Transplant'],
      facilities: facilities ? (Array.isArray(facilities) ? facilities : facilities.split(',').map((f) => f.trim())) : ['VIP International Suites', 'Translators', 'Airport Transfer'],
      beds: beds ? Number(beds) : 450,
      rating: rating ? Number(rating) : 4.8,
      contactEmail: contactEmail || `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: contactPhone || '+91-11-40008888',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
      description: description || `${name} is a premier accredited tertiary medical center for international healthcare.`
    };

    if (mongoose.connection.readyState === 1) {
      const hospital = await Hospital.create(hospitalObj);
      return res.status(201).json({ success: true, data: hospital });
    }

    const newHospital = {
      _id: `hosp_${Date.now()}`,
      ...hospitalObj
    };
    verifiedHospitals.unshift(newHospital);

    res.status(201).json({
      success: true,
      dataSource: 'verified-cache',
      data: newHospital
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  createHospital
};
