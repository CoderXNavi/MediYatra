const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.route('/:id')
  .get(getAppointmentById);

router.route('/:id/status')
  .patch(updateAppointmentStatus);

module.exports = router;
