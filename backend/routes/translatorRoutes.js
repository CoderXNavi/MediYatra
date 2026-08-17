const express = require('express');
const router = express.Router();
const { getTranslators } = require('../controllers/translatorController');

router.get('/', getTranslators);

module.exports = router;
