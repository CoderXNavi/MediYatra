const Report = require('../models/Report');
const mongoose = require('mongoose');

const fallbackReports = [
  {
    _id: 'rep_1001',
    appointmentId: 'apt_1786972976977',
    patientName: 'David Miller',
    doctorName: 'Dr. Ashok Seth',
    hospitalName: 'Apollo Hospitals New Delhi',
    diagnosis: 'Severe Bilateral Knee Joint Osteoarthritis & Reduced Mobility',
    recommendedTreatment: 'Computer-Assisted Total Knee Replacement (TKR)',
    estimatedStayDays: 6,
    estimatedCostUSD: 4500,
    visaInvitationApproved: true,
    createdAt: new Date().toISOString()
  }
];

// @desc    Generate new medical consultation report
// @route   POST /api/reports
// @access  Public / Doctor
const createReport = async (req, res, next) => {
  try {
    const {
      appointmentId,
      patientName,
      doctorName,
      hospitalName,
      diagnosis,
      recommendedTreatment,
      estimatedStayDays,
      estimatedCostUSD
    } = req.body;

    if (!appointmentId || !patientName || !doctorName || !hospitalName || !diagnosis || !recommendedTreatment || !estimatedCostUSD) {
      return res.status(400).json({
        success: false,
        error: 'Please provide appointmentId, patientName, doctorName, hospitalName, diagnosis, recommendedTreatment, and estimatedCostUSD'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const report = await Report.create({
        appointmentId,
        patientName,
        doctorName,
        hospitalName,
        diagnosis,
        recommendedTreatment,
        estimatedStayDays: estimatedStayDays || 7,
        estimatedCostUSD,
        visaInvitationApproved: true
      });

      return res.status(201).json({
        success: true,
        message: 'Medical report & treatment plan created successfully',
        data: report
      });
    }

    const newReport = {
      _id: `rep_${Date.now()}`,
      appointmentId,
      patientName,
      doctorName,
      hospitalName,
      diagnosis,
      recommendedTreatment,
      estimatedStayDays: estimatedStayDays || 7,
      estimatedCostUSD,
      visaInvitationApproved: true,
      createdAt: new Date().toISOString()
    };
    fallbackReports.unshift(newReport);

    res.status(201).json({
      success: true,
      message: 'Medical report & treatment plan created successfully',
      dataSource: 'fallback-cache',
      data: newReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get report by appointment ID
// @route   GET /api/reports/:appointmentId
// @access  Public
const getReportByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const report = await Report.findOne({ appointmentId });
      if (!report) {
        return res.status(404).json({
          success: false,
          error: `Medical report not found for appointment ID: ${appointmentId}`
        });
      }
      return res.status(200).json({
        success: true,
        data: report
      });
    }

    const report = fallbackReports.find((r) => r.appointmentId === appointmentId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: `Medical report not found for appointment ID: ${appointmentId}`
      });
    }

    res.status(200).json({
      success: true,
      dataSource: 'fallback-cache',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export printable Medical Report PDF payload
// @route   GET /api/reports/:id/pdf
// @access  Public
const exportReportPDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    let report = fallbackReports.find((r) => r._id === id || r.appointmentId === id);

    if (mongoose.connection.readyState === 1) {
      const dbReport = await Report.findOne({ $or: [{ _id: id }, { appointmentId: id }] });
      if (dbReport) report = dbReport;
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        error: `Report not found for ID: ${id}`
      });
    }

    const htmlDocument = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Medical Report — MediYatra India</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: bold; color: #064e3b; }
          .badge { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .section { margin-bottom: 20px; }
          .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
          .value { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .footer { border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 16px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">MediYatra — Official Medical Consultation Summary</div>
          <p>Government of India Approved Medical Tourism Digital Platform</p>
        </div>

        <div class="section">
          <div class="label">Report ID & Date</div>
          <div class="value">${report._id} | ${new Date(report.createdAt).toLocaleDateString()}</div>
        </div>

        <div class="section">
          <div class="label">Patient Name</div>
          <div class="value">${report.patientName}</div>
        </div>

        <div class="section">
          <div class="label">Attending Doctor & Hospital</div>
          <div class="value">${report.doctorName} — ${report.hospitalName}</div>
        </div>

        <div class="section">
          <div class="label">Medical Diagnosis</div>
          <div class="value">${report.diagnosis}</div>
        </div>

        <div class="section">
          <div class="label">Recommended Treatment & Duration</div>
          <div class="value">${report.recommendedTreatment} (${report.estimatedStayDays} Days Hospital Recovery)</div>
        </div>

        <div class="section">
          <div class="label">Estimated Procedure Cost</div>
          <div class="value">$${report.estimatedCostUSD} USD</div>
        </div>

        <div class="section">
          <span class="badge">e-Medical Visa Invitation Approved ✅</span>
        </div>

        <div class="footer">
          This document serves as an official medical invitation letter and consultation record for Indian Embassy e-Medical Visa processing.
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlDocument);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReportByAppointment,
  exportReportPDF
};
