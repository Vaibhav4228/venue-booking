const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('venueId', 'name pricePerDay');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bookings for a specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('venueId', 'name pricePerDay');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book a venue
router.post(
  '/',
  authenticateToken,
  [
    body('venueId').isMongoId().withMessage('Invalid venue ID'),
    body('venueName').trim().notEmpty().withMessage('Venue name is required'),
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('date').isDate().withMessage('Invalid date (YYYY-MM-DD)'),
    body('eventType').trim().notEmpty().withMessage('Event type is required'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { venueId, venueName, customerName, email, phone, date, eventType, totalAmount } = req.body;
      const venue = await Venue.findById(venueId);
      if (!venue || !venue.isActive) return res.status(404).json({ message: 'Venue not found' });

      const dateStr = date.split('T')[0];
      if (venue.unavailableDates.includes(dateStr)) {
        return res.status(400).json({ message: 'Venue is not available on this date' });
      }

      const booking = new Booking({
        venueId,
        venueName,
        customerName,
        email,
        phone,
        date: dateStr,
        eventType,
        userId: req.user.id,
        totalAmount,
        status: 'confirmed'
      });

      venue.unavailableDates.push(dateStr);
      await venue.save();
      const newBooking = await booking.save();
      res.status(201).json(newBooking);
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ message: 'Booking already exists for this venue and date' });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  }
);

module.exports = router;