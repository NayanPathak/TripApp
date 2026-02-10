const express = require('express');
const router = express.Router();
const {
  assignPackage,
  getAssignmentsByPackage,
  getMyAssignedPackages,
} = require('../controllers/assignmentController');
const { protect, agentOnly, userOnly } = require('../middleware/auth');

router.post('/', protect, agentOnly, assignPackage);
router.get('/my-packages', protect, userOnly, getMyAssignedPackages);
router.get('/package/:packageId', protect, agentOnly, getAssignmentsByPackage);

module.exports = router;
