const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTreatments,
  getTreatmentById,
  getTreatmentsByHospital,
  createTreatment
} = require('../controllers/treatmentController');

router.route('/')
  .get((req, res, next) => {
    if (req.params.hospitalId) {
      return getTreatmentsByHospital(req, res, next);
    }
    return getTreatments(req, res, next);
  })
  .post(createTreatment);

router.route('/:id')
  .get(getTreatmentById);

module.exports = router;
