const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getHospitalById,
  createHospital
} = require('../controllers/hospitalController');

router.route('/')
  .get(getHospitals)
  .post(createHospital);

router.route('/:id')
  .get(getHospitalById);

module.exports = router;
