const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register); // disabled once admin exists
router.get('/me', protect, getMe);

module.exports = router;
