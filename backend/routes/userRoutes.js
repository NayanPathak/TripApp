const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController');
const { protect, agentOnly } = require('../middleware/auth');

router.use(protect, agentOnly);
router.post('/', createUser);
router.get('/', getAllUsers);

module.exports = router;
