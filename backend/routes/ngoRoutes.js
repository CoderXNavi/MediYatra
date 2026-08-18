const express = require('express');
const router = express.Router();
const { 
  getNGOs, 
  getEquipment, 
  createEquipmentDonation, 
  createAidRequest, 
  getAidRequests, 
  updateAidRequestStatus, 
  verifyNGOByAdmin 
} = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public read routes
router.get('/', getNGOs);
router.get('/equipment', getEquipment);
router.get('/requests', getAidRequests);

// Authenticated mutations
router.post('/donate', createEquipmentDonation);
router.post('/equipment', createEquipmentDonation);
router.post('/request', createAidRequest);

// NGO role routes
router.patch('/requests/:id/status', updateAidRequestStatus);

// Admin verification routes
router.patch('/:id/verify', protect, authorize('Admin'), verifyNGOByAdmin);

module.exports = router;
