const express = require('express');
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  uploadDayImages,
} = require('../controllers/packageController');
const { protect, agentOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect, agentOnly);
router.post('/upload-images', upload.array('images', 10), uploadDayImages);
router.post('/', createPackage);
router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
