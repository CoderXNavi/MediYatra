const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');

const fallbackConsultations = [
  {
    _id: 'con_seed_1',
    patientEmail: 'patient@mediyatra.org',
    patientName: 'Demo Patient',
    patientPhone: '+1 555 0192',
    patientCountry: 'United States',
    doctorId: 'doc_1',
    doctorName: 'Dr. Naresh Trehan',
    hospitalId: 'hosp_1',
    hospitalName: 'Max Super Speciality Hospital Saket',
    subject: 'Pre-Surgical Cardiac Assessment Inquiry',
    message: 'Seeking expert evaluation for CABG procedure and post-op recovery protocol.',
    preferredDate: '2026-08-25T00:00:00.000Z',
    status: 'Pending',
    doctorResponse: '',
    createdAt: new Date().toISOString()
  }
];

// @desc    Submit new patient consultation to doctor
// @route   POST /api/consultations
// @access  Public / Authenticated Patient
const createConsultation = async (req, res, next) => {
  try {
    const {
      patientEmail,
      patientName,
      patientPhone,
      patientCountry,
      doctorId,
      doctorName,
      hospitalId,
      hospitalName,
      subject,
      message,
      preferredDate
    } = req.body;

    if (!patientEmail || !patientName || !doctorName || !message || !preferredDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide patientEmail, patientName, doctorName, message, and preferredDate'
      });
    }

    const cleanEmail = patientEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const consultation = await Consultation.create({
        patientEmail: cleanEmail,
        patientName,
        patientPhone: patientPhone || '',
        patientCountry: patientCountry || 'United States',
        doctorId: doctorId || doctorName,
        doctorName,
        hospitalId: hospitalId || '',
        hospitalName: hospitalName || '',
        subject: subject || `Consultation regarding ${doctorName}`,
        message,
        preferredDate: new Date(preferredDate),
        status: 'Pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Consultation submitted to doctor successfully',
        data: consultation
      });
    }

    // Fallback in-memory storage
    const newConsultation = {
      _id: `con_${Date.now()}`,
      patientEmail: cleanEmail,
      patientName,
      patientPhone: patientPhone || '',
      patientCountry: patientCountry || 'United States',
      doctorId: doctorId || doctorName,
      doctorName,
      hospitalId: hospitalId || '',
      hospitalName: hospitalName || '',
      subject: subject || `Consultation regarding ${doctorName}`,
      message,
      preferredDate: new Date(preferredDate).toISOString(),
      status: 'Pending',
      doctorResponse: '',
      createdAt: new Date().toISOString()
    };
    fallbackConsultations.unshift(newConsultation);

    res.status(201).json({
      success: true,
      message: 'Consultation submitted to doctor successfully',
      dataSource: 'fallback-cache',
      data: newConsultation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get consultations (filtered by patientEmail, doctorId, or doctorName)
// @route   GET /api/consultations
// @access  Public / Authenticated
const getConsultations = async (req, res, next) => {
  try {
    const { patientEmail, doctorId, doctorName, status } = req.query;

    let query = {};
    if (patientEmail) query.patientEmail = patientEmail.trim().toLowerCase();
    if (status) query.status = status;

    if (doctorId || doctorName) {
      const conditions = [];
      if (doctorId) conditions.push({ doctorId: doctorId });
      if (doctorName) conditions.push({ doctorName: { $regex: new RegExp(doctorName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } });
      query.$or = conditions;
    }

    if (mongoose.connection.readyState === 1) {
      const consultations = await Consultation.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: consultations.length,
        data: consultations
      });
    }

    let filtered = [...fallbackConsultations];
    if (patientEmail) {
      filtered = filtered.filter(c => c.patientEmail && c.patientEmail.toLowerCase() === patientEmail.trim().toLowerCase());
    }
    if (doctorId || doctorName) {
      filtered = filtered.filter(c => {
        const matchId = doctorId && (c.doctorId === doctorId || c.doctorId.toString() === doctorId.toString());
        const matchName = doctorName && c.doctorName && c.doctorName.toLowerCase().includes(doctorName.trim().toLowerCase());
        return matchId || matchName;
      });
    }
    if (status) {
      filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
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

// @desc    Doctor responds to consultation and updates status
// @route   PATCH /api/consultations/:id/response
// @access  Public / Authenticated Doctor
const respondToConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctorResponse, status } = req.body;

    if (!doctorResponse) {
      return res.status(400).json({
        success: false,
        error: 'Please provide doctorResponse text'
      });
    }

    const updatedStatus = status || 'Responded';

    if (mongoose.connection.readyState === 1) {
      const consultation = await Consultation.findByIdAndUpdate(
        id,
        {
          doctorResponse,
          status: updatedStatus,
          respondedAt: new Date()
        },
        { new: true }
      );

      if (!consultation) {
        return res.status(404).json({
          success: false,
          error: `Consultation not found with ID: ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Doctor response recorded successfully',
        data: consultation
      });
    }

    const consultation = fallbackConsultations.find(c => c._id === id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: `Consultation not found with ID: ${id}`
      });
    }

    consultation.doctorResponse = doctorResponse;
    consultation.status = updatedStatus;
    consultation.respondedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Doctor response recorded successfully',
      dataSource: 'fallback-cache',
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  respondToConsultation
};
