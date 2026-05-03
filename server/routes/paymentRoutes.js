const express = require('express');
const router = express.Router();
const { verifyPayment, paystackWebhook } = require('../controllers/paymentController');

// Paystack webhook must receive raw body
router.post('/webhook', express.raw({ type: 'application/json' }), paystackWebhook);
router.get('/verify/:reference', verifyPayment);

module.exports = router;
