const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocationBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

router.get('/', getAllLocations);
router.get('/:slug', getLocationBySlug);
router.post('/', protect, createLocation);
router.put('/:id', protect, updateLocation);
router.delete('/:id', protect, deleteLocation);

module.exports = router;
