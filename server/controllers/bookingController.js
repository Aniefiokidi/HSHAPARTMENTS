const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');

// Check if dates conflict with existing bookings
const areDatesAvailable = async (apartmentId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    apartment: apartmentId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
    ],
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const conflict = await Booking.findOne(query);
  return !conflict;
};

const createBooking = async (req, res) => {
  try {
    const {
      apartmentId,
      fullName,
      phone,
      email,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
    } = req.body;

    if (!apartmentId || !fullName || !phone || !email || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment)
      return res.status(404).json({ success: false, message: 'Apartment not found' });

    if (!apartment.isAvailable)
      return res.status(400).json({ success: false, message: 'This apartment is not available for booking' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn)
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in' });

    const available = await areDatesAvailable(apartmentId, checkIn, checkOut);
    if (!available)
      return res.status(409).json({ success: false, message: 'Selected dates are not available' });

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * apartment.price;
    const depositAmount = parseFloat((totalPrice * 0.1).toFixed(2));

    const booking = await Booking.create({
      apartment: apartmentId,
      fullName,
      phone,
      email,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice,
      depositAmount,
      specialRequests: specialRequests || '',
    });

    await booking.populate('apartment', 'title images price location');

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'apartment',
      'title images price location'
    );
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: get all bookings
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.apartment) filter.apartment = req.query.apartment;

    const bookings = await Booking.find(filter)
      .populate('apartment', 'title location')
      .sort('-createdAt');

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getBookingById, getAllBookings, cancelBooking };
