const express = require('express');
const router = express.Router();
const {
  getAllApartments,
  getApartmentById,
  getBookedDates,
  createApartment,
  updateApartment,
  deleteApartment,
} = require('../controllers/apartmentController');
const { protect } = require('../middleware/auth');

router.get('/', getAllApartments);
router.get('/:id', getApartmentById);
router.get('/:id/booked-dates', getBookedDates);
router.post('/', protect, createApartment);
router.put('/:id', protect, updateApartment);
router.delete('/:id', protect, deleteApartment);

module.exports = router;
