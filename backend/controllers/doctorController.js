const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');
const { verifiedDoctors } = require('../data/verifiedIndianHealthcareData');

// @desc    Get all doctors with optional filtering
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { specialty, hospitalId, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
      if (hospitalId) query.hospitalId = hospitalId;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialty: { $regex: search, $options: 'i' } },
          { qualifications: { $regex: search, $options: 'i' } }
        ];
      }

      let doctors = await Doctor.find(query).populate('hospitalId', 'name city rating').sort({ experienceYears: -1 });

      if (doctors.length === 0 && !specialty && !hospitalId && !search) {
        doctors = await Doctor.insertMany(verifiedDoctors);
      }

      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    }

    let filtered = [...verifiedDoctors];
    if (specialty) filtered = filtered.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    if (hospitalId) filtered = filtered.filter((d) => d.hospitalId === hospitalId);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
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

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const doctor = await Doctor.findById(id).populate('hospitalId');
      if (doctor) return res.status(200).json({ success: true, data: doctor });
    }

    const doctor = verifiedDoctors.find((d) => d._id === id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: `Doctor not found with id of ${id}` });
    }

    res.status(200).json({ success: true, dataSource: 'verified-cache', data: doctor });
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
      return res.status(200).json({ success: true, count: doctors.length, data: doctors });
    }

    const filtered = verifiedDoctors.filter((d) => d.hospitalId === hospitalId);
    res.status(200).json({ success: true, count: filtered.length, dataSource: 'verified-cache', data: filtered });
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

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide doctor name'
      });
    }

    const doctorObj = {
      hospitalId: hospitalId || 'hosp_apollo_delhi',
      name,
      specialty: specialty || 'Cardiology',
      qualifications: qualifications || 'MBBS, MD, FRCS',
      experienceYears: experienceYears !== undefined ? Number(experienceYears) : 18,
      languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
      consultationFeeUSD: consultationFeeUSD !== undefined ? Number(consultationFeeUSD) : 60,
      availableDays: Array.isArray(availableDays) ? availableDays : ['Monday', 'Wednesday', 'Friday'],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
    };

    if (mongoose.connection.readyState === 1) {
      const doctor = await Doctor.create(doctorObj);
      return res.status(201).json({ success: true, data: doctor });
    }

    const newDoctor = {
      _id: `doc_${Date.now()}`,
      ...doctorObj
    };
    verifiedDoctors.unshift(newDoctor);

    res.status(201).json({
      success: true,
      dataSource: 'verified-cache',
      data: newDoctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Complete authenticated Doctor profile
// @route   PATCH /api/doctors/profile
// @access  Public / Doctor
const updateDoctorProfile = async (req, res, next) => {
  try {
    const { name, specialty, qualifications, experienceYears, consultationFeeUSD, languages, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Doctor name is required' });
    }

    if (mongoose.connection.readyState === 1) {
      let doctor = await Doctor.findOne({ name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
      if (doctor) {
        if (specialty) doctor.specialty = specialty;
        if (qualifications) doctor.qualifications = qualifications;
        if (experienceYears !== undefined) doctor.experienceYears = Number(experienceYears);
        if (consultationFeeUSD !== undefined) doctor.consultationFeeUSD = Number(consultationFeeUSD);
        if (languages) doctor.languages = Array.isArray(languages) ? languages : languages.split(',').map(l=>l.trim());
        if (imageUrl) doctor.imageUrl = imageUrl;
        await doctor.save();
      } else {
        doctor = await Doctor.create({
          hospitalId: 'hosp_apollo_delhi',
          name,
          specialty: specialty || 'General Medicine & Senior Specialist',
          qualifications: qualifications || 'MBBS, MD',
          experienceYears: Number(experienceYears) || 12,
          languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
          consultationFeeUSD: Number(consultationFeeUSD) || 50,
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          imageUrl: imageUrl || ''
        });
      }

      return res.status(200).json({ success: true, message: 'Doctor profile updated successfully', data: doctor });
    }

    let doc = verifiedDoctors.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (doc) {
      if (specialty) doc.specialty = specialty;
      if (qualifications) doc.qualifications = qualifications;
      if (experienceYears !== undefined) doc.experienceYears = Number(experienceYears);
      if (consultationFeeUSD !== undefined) doc.consultationFeeUSD = Number(consultationFeeUSD);
      if (languages) doc.languages = Array.isArray(languages) ? languages : languages.split(',').map(l=>l.trim());
      if (imageUrl) doc.imageUrl = imageUrl;
    } else {
      doc = {
        _id: `doc_${Date.now()}`,
        hospitalId: 'hosp_apollo_delhi',
        name,
        specialty: specialty || 'General Medicine & Senior Specialist',
        qualifications: qualifications || 'MBBS, MD',
        experienceYears: Number(experienceYears) || 12,
        languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
        consultationFeeUSD: Number(consultationFeeUSD) || 50,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        imageUrl: imageUrl || ''
      };
      verifiedDoctors.unshift(doc);
    }

    res.status(200).json({ success: true, message: 'Doctor profile updated successfully', dataSource: 'verified-cache', data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorsByHospital,
  createDoctor,
  updateDoctorProfile
};
