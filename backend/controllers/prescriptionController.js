const Prescription = require('../models/Prescription');
const mongoose = require('mongoose');

const fallbackPrescriptions = [
  {
    _id: 'rx_001',
    appointmentId: 'apt_1786972976977',
    patientName: 'David Miller',
    doctorName: 'Dr. Ashok Seth',
    medications: [
      {
        medicineName: 'Cefuroxime 500mg',
        dosage: '1 tablet',
        frequency: 'Twice daily (8 AM / 8 PM)',
        durationDays: 7,
        specialInstructions: 'Take after meals'
      },
      {
        medicineName: 'Enoxaparin Sodium Injection',
        dosage: '40mg sub-Q',
        frequency: 'Once daily (Post-op DVT prophylaxis)',
        durationDays: 5,
        specialInstructions: 'Subcutaneous injection'
      },
      {
        medicineName: 'Paracetamol 650mg',
        dosage: '1 tablet',
        frequency: 'As needed for pain (Max 3 times daily)',
        durationDays: 10,
        specialInstructions: 'Do not exceed 4000mg per day'
      }
    ],
    nextFollowUpDate: new Date('2026-10-22').toISOString(),
    createdAt: new Date().toISOString()
  }
];

// @desc    Create prescription & medication schedule
// @route   POST /api/prescriptions
// @access  Public / Doctor
const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, patientName, doctorName, medications, nextFollowUpDate } = req.body;

    if (!appointmentId || !patientName || !doctorName || !medications || !Array.isArray(medications)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide appointmentId, patientName, doctorName, and an array of medications'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const prescription = await Prescription.create({
        appointmentId,
        patientName,
        doctorName,
        medications,
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null
      });

      return res.status(201).json({
        success: true,
        message: 'Prescription & Medication Schedule created successfully',
        data: prescription
      });
    }

    const newPrescription = {
      _id: `rx_${Date.now()}`,
      appointmentId,
      patientName,
      doctorName,
      medications,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate).toISOString() : null,
      createdAt: new Date().toISOString()
    };
    fallbackPrescriptions.unshift(newPrescription);

    res.status(201).json({
      success: true,
      message: 'Prescription & Medication Schedule created successfully',
      dataSource: 'fallback-cache',
      data: newPrescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescription by appointment ID
// @route   GET /api/prescriptions/:appointmentId
// @access  Public
const getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const prescription = await Prescription.findOne({ appointmentId });
      if (!prescription) {
        return res.status(404).json({
          success: false,
          error: `Prescription schedule not found for appointment ID: ${appointmentId}`
        });
      }
      return res.status(200).json({
        success: true,
        data: prescription
      });
    }

    const rx = fallbackPrescriptions.find((p) => p.appointmentId === appointmentId);
    if (!rx) {
      return res.status(404).json({
        success: false,
        error: `Prescription schedule not found for appointment ID: ${appointmentId}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: rx
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptionByAppointment
};
