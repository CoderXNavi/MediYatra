const express = require('express');
const router = express.Router();
const {
  createTourismOrder,
  getTourismOrders,
  updateTourismOrderStatus
} = require('../controllers/tourismController');

router.post('/', createTourismOrder);
router.get('/', getTourismOrders);
router.patch('/:id/status', updateTourismOrderStatus);

module.exports = router;
