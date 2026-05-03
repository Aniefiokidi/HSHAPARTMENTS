const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(admin._id);
    res.json({ success: true, token, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// One-time setup route (disabled once an admin exists)
const register = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(403).json({ success: false, message: 'Admin registration is closed' });
    }

    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const admin = await Admin.create({ name, email, password });
    const token = signToken(admin._id);
    res.status(201).json({ success: true, token, data: admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

module.exports = { login, register, getMe };
