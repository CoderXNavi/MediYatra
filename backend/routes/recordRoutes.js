const express = require('express');
const router = express.Router();
const { uploadRecord, getRecordsByAppointment } = require('../controllers/recordController');

router.post('/', uploadRecord);
router.get('/:appointmentId', getRecordsByAppointment);

module.exports = router;
