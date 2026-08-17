const express = require('express');
const router = express.Router();
const { recommendCare } = require('../controllers/aiController');

router.post('/recommend', recommendCare);

module.exports = router;
