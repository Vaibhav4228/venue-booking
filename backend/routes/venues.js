const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const { body, validationResult } = require('express-validator');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all active venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({ isActive: true });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new venue (admin only)
router.post(
  '/',
  authenticateToken,
  isAdmin,
  [
    body('name').trim().notEmpty().withMessage('Venue name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('pricePerDay').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('amenities').isArray().withMessage('Amenities must be an array'),
    body('image').optional().isURL().withMessage('Image must be a valid URL')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const venue = new Venue({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      capacity: req.body.capacity,
      pricePerDay: req.body.pricePerDay,
      amenities: req.body.amenities,
      image: req.body.image
    });

    try {
      const newVenue = await venue.save();
      res.status(201).json(newVenue);
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ message: 'Venue name already exists' });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  });

// Get blocked dates for a venue
router.get('/:id/blocked-dates', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue || !venue.isActive) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue.unavailableDates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update venue availability (admin only)
router.patch(
  '/:id/availability',
  authenticateToken,
  isAdmin,
  [
    body('unavailableDates').isArray().withMessage('Unavailable dates must be an array'),
    body('unavailableDates.*').isDate().withMessage('Each date must be a valid date (YYYY-MM-DD)')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const venue = await Venue.findById(req.params.id);
      if (!venue || !venue.isActive) return res.status(404).json({ message: 'Venue not found' });

      venue.unavailableDates = req.body.unavailableDates;
      await venue.save();
      res.json(venue);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get bookings for a specific venue
router.get('/:id/bookings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ venueId: req.params.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;