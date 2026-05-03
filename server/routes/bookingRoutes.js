const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getAllBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.get('/', protect, getAllBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
