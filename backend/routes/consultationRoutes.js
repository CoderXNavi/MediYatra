const express = require('express');
const router = express.Router();
const { 
  createConsultation, 
  getConsultations, 
  respondToConsultation 
} = require('../controllers/consultationController');

router.post('/', createConsultation);
router.get('/', getConsultations);
router.patch('/:id/response', respondToConsultation);

module.exports = router;
