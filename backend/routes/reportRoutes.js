const express = require('express');
const router = express.Router();
const { createReport, getReportByAppointment, exportReportPDF } = require('../controllers/reportController');

router.post('/', createReport);
router.get('/:appointmentId', getReportByAppointment);
router.get('/:id/pdf', exportReportPDF);

module.exports = router;
