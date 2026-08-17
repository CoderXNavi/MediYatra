const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

const fallbackAppointments = [];

// @desc    Submit new consultation / appointment request
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res, next) => {
  try {
    const {
      hospitalId,
      doctorId,
      treatmentId,
      patientName,
      patientEmail,
      patientPhone,
      patientCountry,
      preferredDate,
      medicalNotes
    } = req.body;

    // Validate Mandatory Fields
    if (!hospitalId || !patientName || !patientEmail || !patientPhone || !patientCountry || !preferredDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all mandatory fields: hospitalId, patientName, patientEmail, patientPhone, patientCountry, preferredDate'
      });
    }

    // Validate Email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(patientEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid patient email address'
      });
    }

    // Validate Date is in the future
    const appointmentDate = new Date(preferredDate);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid appointment date format'
      });
    }

    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Preferred appointment date must be a future date'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.create({
        hospitalId,
        doctorId: doctorId || null,
        treatmentId: treatmentId || null,
        patientName,
        patientEmail,
        patientPhone,
        patientCountry,
        preferredDate: appointmentDate,
        status: 'Pending',
        medicalNotes: medicalNotes || ''
      });

      return res.status(201).json({
        success: true,
        message: 'Appointment request submitted successfully',
        data: appointment
      });
    }

    // Fallback mode
    const newAppointment = {
      _id: `apt_${Date.now()}`,
      hospitalId,
      doctorId: doctorId || null,
      treatmentId: treatmentId || null,
      patientName,
      patientEmail,
      patientPhone,
      patientCountry,
      preferredDate: appointmentDate.toISOString(),
      status: 'Pending',
      medicalNotes: medicalNotes || '',
      createdAt: new Date().toISOString()
    };
    fallbackAppointments.unshift(newAppointment);

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      dataSource: 'fallback-cache',
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lookup appointment request status by ID
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(id)
        .populate('hospitalId', 'name city contactPhone')
        .populate('doctorId', 'name specialty')
        .populate('treatmentId', 'name estimatedCostUSD');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: `Appointment request not found with tracking ID: ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        data: appointment
      });
    }

    const appointment = fallbackAppointments.find((a) => a._id === id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Appointment request not found with tracking ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all appointments (For Admin / Healthcare Provider management)
// @route   GET /api/appointments
// @access  Public / Admin
const getAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (status) {
        query.status = status;
      }

      const appointments = await Appointment.find(query)
        .populate('hospitalId', 'name city')
        .populate('doctorId', 'name specialty')
        .populate('treatmentId', 'name estimatedCostUSD')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    }

    let filtered = [...fallbackAppointments];
    if (status) {
      filtered = filtered.filter((a) => a.status.toLowerCase() === status.toLowerCase());
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

// @desc    Update appointment request status
// @route   PATCH /api/appointments/:id/status
// @access  Public / Admin
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Please provide a valid status: ${validStatuses.join(', ')}`
      });
    }

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: `Appointment request not found with ID: ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Appointment status updated to ${status}`,
        data: appointment
      });
    }

    const appointment = fallbackAppointments.find((a) => a._id === id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Appointment request not found with ID: ${id}`
      });
    }

    appointment.status = status;
    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      dataSource: 'fallback-cache',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointmentStatus
};
