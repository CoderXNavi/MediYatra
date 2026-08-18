const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAdminUsers,
  updateUserStatus
} = require('../controllers/adminController');

// All /api/admin routes require Server-Side Token Authentication (401) and Admin Role Authorization (403)
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);

module.exports = router;
