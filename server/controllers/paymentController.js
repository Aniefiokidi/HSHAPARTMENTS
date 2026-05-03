const axios = require('axios');
const Booking = require('../models/Booking');

const PAYSTACK_BASE = 'https://api.paystack.co';

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Payment reference is required' });
    }

    // Verify with Paystack
    const response = await axios.get(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const { data } = response.data;

    if (data.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Find the booking by reference or metadata
    const bookingId =
      data.metadata?.bookingId || data.metadata?.custom_fields?.find((f) => f.variable_name === 'booking_id')?.value;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID not found in payment metadata' });
    }

    const booking = await Booking.findById(bookingId).populate('apartment', 'title images price');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Idempotent: if already confirmed, just return
    if (booking.paymentStatus === 'paid') {
      return res.json({ success: true, data: booking });
    }

    // Confirm deposit amount matches (within 1 kobo tolerance for floating point)
    const paidAmount = data.amount / 100; // convert kobo to NGN
    if (Math.abs(paidAmount - booking.depositAmount) > 1) {
      return res.status(400).json({
        success: false,
        message: `Amount mismatch: expected ₦${booking.depositAmount}, received ₦${paidAmount}`,
      });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paystackReference = reference;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(400).json({ success: false, message: 'Invalid payment reference' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook for server-side payment confirmation (backup)
const paystackWebhook = async (req, res) => {
  try {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const bookingId = metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'paid',
          status: 'confirmed',
          paystackReference: reference,
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { verifyPayment, paystackWebhook };
