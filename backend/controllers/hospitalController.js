const Hospital = require('../models/Hospital');
const mongoose = require('mongoose');

// Fallback in-memory dataset when MongoDB is offline during initial local dev setup
const fallbackHospitals = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Apollo Hospitals',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    address: 'Sarita Vihar, Mathura Road, New Delhi, Delhi 110076',
    specialties: ['Cardiology', 'Orthopedics', 'Oncology', 'Organ Transplant'],
    facilities: ['VIP International Suites', 'Translators', 'Airport Pickup', 'Visa Assistance'],
    rating: 4.9,
    contactEmail: 'international@apollohospitals.com',
    contactPhone: '+91-11-26925858',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    description: 'Apollo Hospitals New Delhi is a JCI-accredited flagship hospital offering world-class tertiary care.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Fortis Memorial Research Institute',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    address: 'Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002',
    specialties: ['Oncology', 'Cardiology', 'Neurosciences', 'Bone Marrow Transplant'],
    facilities: ['International Patient Lounge', 'Customized Dietary Menu', 'Currency Exchange'],
    rating: 4.8,
    contactEmail: 'fmri.international@fortishealthcare.com',
    contactPhone: '+91-124-4921021',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'Fortis Memorial Research Institute is a multi-super-specialty quaternary care hospital boasting top-tier medical faculty.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Max Super Speciality Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi, Delhi 110017',
    specialties: ['Cardiac Sciences', 'Orthopedics & Joint Replacement', 'Dental Sciences'],
    facilities: ['Dedicated International Desk', 'Interpreter Support', '5-Star Accommodation Partner'],
    rating: 4.7,
    contactEmail: 'intl.service@maxhealthcare.com',
    contactPhone: '+91-11-26515050',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    description: 'Max Super Speciality Hospital Saket is renowned across Asia for high success rates in cardiac and orthopedic procedures.'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d4',
    name: 'Manipal Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
    specialties: ['Cosmetic Surgery', 'Dental Surgery', 'Hair Transplantation', 'Fertility Care'],
    facilities: ['Private Patient Suites', 'Concierge Service', 'In-house Pharmacy'],
    rating: 4.8,
    contactEmail: 'info@manipalhospitals.com',
    contactPhone: '+91-80-25024444',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    description: 'Manipal Hospital Bengaluru is a pioneer in wellness and aesthetic medical tourism.'
  }
];

// @desc    Get all hospitals with optional filtering (city, specialty, search)
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res, next) => {
  try {
    const { city, specialty, search } = req.query;

    // Check DB connection status (1 = connected)
    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }
      if (specialty) {
        query.specialties = { $regex: specialty, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { specialties: { $regex: search, $options: 'i' } }
        ];
      }

      const hospitals = await Hospital.find(query).sort({ rating: -1, createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: hospitals.length,
        data: hospitals
      });
    }

    // Fallback mode if MongoDB daemon isn't running
    let filtered = [...fallbackHospitals];
    if (city) {
      filtered = filtered.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (specialty) {
      filtered = filtered.filter((h) => h.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase())));
    }
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
      dataSource: 'fallback-cache',
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
      if (!hospital) {
        return res.status(404).json({
          success: false,
          error: `Hospital not found with id of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: hospital
      });
    }

    // Fallback mode
    const hospital = fallbackHospitals.find((h) => h._id === id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        error: `Hospital not found with id of ${id}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: hospital
    });
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
      rating,
      contactEmail,
      contactPhone,
      imageUrl,
      description
    } = req.body;

    if (!name || !city || !state || !address || !specialties || !contactEmail || !contactPhone || !imageUrl || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all mandatory fields: name, city, state, address, specialties, contactEmail, contactPhone, imageUrl, description'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const hospital = await Hospital.create({
        name,
        city,
        state,
        country: country || 'India',
        address,
        specialties: Array.isArray(specialties) ? specialties : specialties.split(',').map((s) => s.trim()),
        facilities: Array.isArray(facilities) ? facilities : facilities ? facilities.split(',').map((f) => f.trim()) : [],
        rating: rating || 4.5,
        contactEmail,
        contactPhone,
        imageUrl,
        description
      });

      return res.status(201).json({
        success: true,
        data: hospital
      });
    }

    // Fallback mode
    const newHospital = {
      _id: `hosp_${Date.now()}`,
      name,
      city,
      state,
      country: country || 'India',
      address,
      specialties: Array.isArray(specialties) ? specialties : specialties.split(',').map((s) => s.trim()),
      facilities: Array.isArray(facilities) ? facilities : [],
      rating: rating || 4.5,
      contactEmail,
      contactPhone,
      imageUrl,
      description
    };
    fallbackHospitals.unshift(newHospital);

    res.status(201).json({
      success: true,
      dataSource: 'fallback-cache',
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
