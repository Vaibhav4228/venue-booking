const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  pricePerDay: { type: Number, required: true, min: 0 },
  amenities: [{ type: String }],
  image: { type: String },
  unavailableDates: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', venueSchema);