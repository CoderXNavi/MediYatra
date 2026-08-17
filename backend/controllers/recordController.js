const Record = require('../models/Record');
const mongoose = require('mongoose');

const fallbackRecords = [];

// @desc    Upload pre-travel medical record
// @route   POST /api/records
// @access  Public
const uploadRecord = async (req, res, next) => {
  try {
    const { appointmentId, patientEmail, documentType, fileUrl, notes } = req.body;

    if (!appointmentId || !patientEmail || !documentType || !fileUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide appointmentId, patientEmail, documentType, and fileUrl'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const record = await Record.create({
        appointmentId,
        patientEmail,
        documentType,
        fileUrl,
        notes: notes || ''
      });

      return res.status(201).json({
        success: true,
        message: 'Pre-travel medical record uploaded successfully',
        data: record
      });
    }

    const newRecord = {
      _id: `rec_${Date.now()}`,
      appointmentId,
      patientEmail,
      documentType,
      fileUrl,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    fallbackRecords.unshift(newRecord);

    res.status(201).json({
      success: true,
      message: 'Pre-travel medical record uploaded successfully',
      dataSource: 'fallback-cache',
      data: newRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get medical records for an appointment
// @route   GET /api/records/:appointmentId
// @access  Public
const getRecordsByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const records = await Record.find({ appointmentId });
      return res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    }

    const filtered = fallbackRecords.filter((r) => r.appointmentId === appointmentId);
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

module.exports = {
  uploadRecord,
  getRecordsByAppointment
};
