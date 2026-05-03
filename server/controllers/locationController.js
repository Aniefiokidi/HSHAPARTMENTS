const Location = require('../models/Location');

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort('name');
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLocationBySlug = async (req, res) => {
  try {
    const requestedSlug = toSlug(req.params.slug || '');
    const slugPattern = new RegExp(`^${requestedSlug}-*$`, 'i');

    const location = await Location.findOne({
      $or: [{ slug: requestedSlug }, { slug: { $regex: slugPattern } }],
    });

    if (!location)
      return res.status(404).json({ success: false, message: 'Location not found' });

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !description)
      return res.status(400).json({ success: false, message: 'Name and description are required' });

    const slug = toSlug(name);

    const existing = await Location.findOne({ slug });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: 'A location with this name already exists' });

    const location = await Location.create({ name, slug, description, image: image || '' });
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name) payload.slug = toSlug(payload.name);

    const location = await Location.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!location)
      return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location)
      return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllLocations,
  getLocationBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
};
