const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getDoctors,
  getDoctorById,
  getDoctorsByHospital,
  createDoctor,
  updateDoctorProfile
} = require('../controllers/doctorController');

router.route('/')
  .get((req, res, next) => {
    if (req.params.hospitalId) {
      return getDoctorsByHospital(req, res, next);
    }
    return getDoctors(req, res, next);
  })
  .post(createDoctor);

router.patch('/profile', updateDoctorProfile);

router.route('/:id')
  .get(getDoctorById);

module.exports = router;
