const Apartment = require('../models/Apartment');
const Booking = require('../models/Booking');

const getAllApartments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.location) filter.location = req.query.location;
    if (req.query.available === 'true') filter.isAvailable = true;

    const apartments = await Apartment.find(filter)
      .populate('location', 'name slug')
      .sort('-createdAt');

    res.json({ success: true, data: apartments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id).populate(
      'location',
      'name slug description'
    );
    if (!apartment)
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, data: apartment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Returns all booked date ranges so calendar can block them
const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      apartment: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
      checkOutDate: { $gte: new Date() },
    }).select('checkInDate checkOutDate');

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    await apartment.populate('location', 'name slug');
    res.status(201).json({ success: true, data: apartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('location', 'name slug');
    if (!apartment)
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, data: apartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment)
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, message: 'Apartment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllApartments,
  getApartmentById,
  getBookedDates,
  createApartment,
  updateApartment,
  deleteApartment,
};
