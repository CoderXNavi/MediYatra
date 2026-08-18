const express = require('express');
const router = express.Router();
const { getAmbulances, dispatchAmbulance } = require('../controllers/ambulanceController');

router.get('/', getAmbulances);
router.post('/dispatch', dispatchAmbulance);

module.exports = router;
