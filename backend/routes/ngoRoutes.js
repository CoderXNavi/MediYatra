const express = require('express');
const router = express.Router();
const { getNGOs, applyForAid } = require('../controllers/ngoController');

router.get('/', getNGOs);
router.post('/apply', applyForAid);

module.exports = router;
