const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

// Get dashboard analytics
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);
    const startOfLastMonth = startOfMonth(subMonths(currentDate, 1));
    const endOfLastMonth = endOfMonth(subMonths(currentDate, 1));

    const totalVenues = await Venue.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const currentMonthBookings = await Booking.find({
      createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
      status: { $in: ['confirmed', 'completed'] }
    }).populate('venueId', 'pricePerDay');

    const lastMonthBookings = await Booking.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      status: { $in: ['confirmed', 'completed'] }
    }).populate('venueId', 'pricePerDay');

    const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const bookingGrowth = lastMonthBookings.length > 0 ? ((currentMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100 : 0;

    res.json({
      totalVenues,
      totalBookings,
      currentMonthRevenue,
      lastMonthRevenue,
      revenueGrowth: revenueGrowth.toFixed(2),
      currentMonthBookings: currentMonthBookings.length,
      lastMonthBookings: lastMonthBookings.length,
      bookingGrowth: bookingGrowth.toFixed(2),
      avgBookingValue: currentMonthBookings.length > 0 ? (currentMonthRevenue / currentMonthBookings.length).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard analytics', error: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    let startDate = period === '1year' ? subMonths(new Date(), 12) : subMonths(new Date(), 6);

    const bookings = await Booking.find({
      createdAt: { $gte: startDate },
      status: { $in: ['confirmed', 'completed'] }
    }).populate('venueId', 'pricePerDay');

    const monthlyRevenue = {};
    bookings.forEach(booking => {
      const month = format(booking.createdAt, 'MMM yyyy');
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (booking.totalAmount || 0);
    });

    const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue
    }));

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue analytics', error: error.message });
  }
});

// Get booking analytics
router.get('/bookings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    let startDate = period === '1year' ? subMonths(new Date(), 12) : subMonths(new Date(), 6);

    const bookings = await Booking.find({ createdAt: { $gte: startDate } });

    const monthlyBookings = {};
    bookings.forEach(booking => {
      const month = format(booking.createdAt, 'MMM yyyy');
      monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
    });

    const bookingData = Object.entries(monthlyBookings).map(([month, count]) => ({
      month,
      bookings: count
    }));

    const eventTypes = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusDistribution = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      monthlyBookings: bookingData,
      eventTypes,
      statusDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking analytics', error: error.message });
  }
});

// Get venue performance analytics
router.get('/venues', authenticateToken, isAdmin, async (req, res) => {
  try {
    const venues = await Venue.find();

    const venuePerformance = await Promise.all(
      venues.map(async (venue) => {
        const bookings = await Booking.find({
          venueId: venue._id,
          status: { $in: ['confirmed', 'completed'] }
        });

        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        const occupancyRate = bookings.length; // Simplified occupancy

        return {
          venueId: venue._id,
          name: venue.name,
          location: venue.location,
          totalBookings: bookings.length,
          totalRevenue,
          occupancyRate,
          avgBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0
        };
      })
    );

    venuePerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);
    res.json(venuePerformance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venue analytics', error: error.message });
  }
});

// Get customer analytics
router.get('/customers', authenticateToken, isAdmin, async (req, res) => {
  try {
    const customerStats = await Booking.aggregate([
      {
        $group: {
          _id: '$email',
          customerName: { $first: '$customerName' },
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastBooking: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 50 }
    ]);

    const repeatCustomers = customerStats.filter(customer => customer.totalBookings > 1);
    const repeatRate = customerStats.length > 0 ? (repeatCustomers.length / customerStats.length) * 100 : 0;

    res.json({
      topCustomers: customerStats.slice(0, 10),
      repeatCustomers: repeatCustomers.length,
      repeatRate: repeatRate.toFixed(2),
      totalUniqueCustomers: customerStats.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer analytics', error: error.message });
  }
});

module.exports = router;