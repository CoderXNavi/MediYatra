const express = require('express');
const router = express.Router();
const { getAmbulances } = require('../controllers/ambulanceController');

router.get('/', getAmbulances);

module.exports = router;
