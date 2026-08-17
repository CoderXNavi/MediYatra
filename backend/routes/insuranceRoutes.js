const express = require('express');
const router = express.Router();
const { getInsurancePlans } = require('../controllers/insuranceController');

router.get('/', getInsurancePlans);

module.exports = router;
