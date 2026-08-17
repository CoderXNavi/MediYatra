const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

const fallbackDoctors = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d5',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Dr. Ashok Seth',
    specialty: 'Cardiology',
    qualifications: 'MBBS, MD, FRCP, FACC',
    experienceYears: 32,
    languages: ['English', 'Hindi'],
    consultationFeeUSD: 60,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d6',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Dr. IPS Oberoi',
    specialty: 'Orthopedics',
    qualifications: 'MBBS, MS (Orthopedics), M.Ch',
    experienceYears: 28,
    languages: ['English', 'Hindi', 'Arabic'],
    consultationFeeUSD: 50,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d7',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Dr. Vinod Raina',
    specialty: 'Oncology',
    qualifications: 'MBBS, MD, DM (Medical Oncology)',
    experienceYears: 35,
    languages: ['English', 'Hindi'],
    consultationFeeUSD: 70,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c0d8',
    hospitalId: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Dr. Anurag Krishna',
    specialty: 'Dental Sciences',
    qualifications: 'BDS, MDS (Prosthodontics)',
    experienceYears: 18,
    languages: ['English', 'Hindi'],
    consultationFeeUSD: 35,
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
  }
];

// @desc    Get all doctors with optional filtering (specialty, hospitalId, search)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { specialty, hospitalId, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (specialty) {
        query.specialty = { $regex: specialty, $options: 'i' };
      }
      if (hospitalId) {
        query.hospitalId = hospitalId;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialty: { $regex: search, $options: 'i' } },
          { qualifications: { $regex: search, $options: 'i' } }
        ];
      }

      const doctors = await Doctor.find(query).populate('hospitalId', 'name city rating').sort({ experienceYears: -1 });

      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    }

    // Fallback mode
    let filtered = [...fallbackDoctors];
    if (specialty) {
      filtered = filtered.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
    if (hospitalId) {
      filtered = filtered.filter((d) => d.hospitalId === hospitalId);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
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

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const doctor = await Doctor.findById(id).populate('hospitalId');
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: `Doctor not found with id of ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: doctor
      });
    }

    const doctor = fallbackDoctors.find((d) => d._id === id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: `Doctor not found with id of ${id}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctors by Hospital ID
// @route   GET /api/hospitals/:hospitalId/doctors
// @access  Public
const getDoctorsByHospital = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const doctors = await Doctor.find({ hospitalId }).sort({ experienceYears: -1 });
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    }

    const filtered = fallbackDoctors.filter((d) => d.hospitalId === hospitalId);
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

// @desc    Create new doctor profile
// @route   POST /api/doctors
// @access  Public / Admin
const createDoctor = async (req, res, next) => {
  try {
    const {
      hospitalId,
      name,
      specialty,
      qualifications,
      experienceYears,
      languages,
      consultationFeeUSD,
      availableDays,
      imageUrl
    } = req.body;

    if (!hospitalId || !name || !specialty || !qualifications || experienceYears === undefined || !consultationFeeUSD) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all mandatory fields: hospitalId, name, specialty, qualifications, experienceYears, consultationFeeUSD'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const doctor = await Doctor.create({
        hospitalId,
        name,
        specialty,
        qualifications,
        experienceYears,
        languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
        consultationFeeUSD,
        availableDays: Array.isArray(availableDays) ? availableDays : ['Monday', 'Wednesday', 'Friday'],
        imageUrl: imageUrl || ''
      });

      return res.status(201).json({
        success: true,
        data: doctor
      });
    }

    const newDoctor = {
      _id: `doc_${Date.now()}`,
      hospitalId,
      name,
      specialty,
      qualifications,
      experienceYears,
      languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
      consultationFeeUSD,
      availableDays: Array.isArray(availableDays) ? availableDays : ['Monday', 'Wednesday', 'Friday'],
      imageUrl: imageUrl || ''
    };
    fallbackDoctors.unshift(newDoctor);

    res.status(201).json({
      success: true,
      dataSource: 'fallback-cache',
      data: newDoctor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorsByHospital,
  createDoctor
};
