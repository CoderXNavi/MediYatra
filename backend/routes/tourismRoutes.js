const express = require('express');
const router = express.Router();
const {
  createTourismOrder,
  getTourismOrders,
  approveByHospital,
  dispatchByAdmin,
  completeByDoctor
} = require('../controllers/tourismController');

router.post('/', createTourismOrder);
router.get('/', getTourismOrders);
router.patch('/:id/hospital-approve', approveByHospital);
router.patch('/:id/admin-dispatch', dispatchByAdmin);
router.patch('/:id/doctor-complete', completeByDoctor);

module.exports = router;
