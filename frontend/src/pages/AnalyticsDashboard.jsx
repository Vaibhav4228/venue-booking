import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChart3, IndianRupee  , Users, Building } from 'lucide-react';
import { venueApi } from '../services/venueApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [venueData, setVenueData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [period, setPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const [summary, revenue, bookings, venues, customers] = await Promise.all([
        venueApi.getAnalyticsSummary(),
        venueApi.getRevenueAnalytics(period),
        venueApi.getBookingAnalytics(period),
        venueApi.getVenueAnalytics(),
        venueApi.getCustomerAnalytics()
      ]);
      setSummary(summary);
      setRevenueData(revenue);
      setBookingData(bookings);
      setVenueData(venues);
      setCustomerData(customers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: revenueData.map(d => d.month),
    datasets: [{
      label: 'Revenue',
      data: revenueData.map(d => d.revenue),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  };

  const bookingChartData = {
    labels: bookingData.monthlyBookings?.map(d => d.month) || [],
    datasets: [{
      label: 'Bookings',
      data: bookingData.monthlyBookings?.map(d => d.bookings) || [],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1
    }]
  };

  const eventTypeChartData = {
    labels: bookingData.eventTypes?.map(t => t._id) || [],
    datasets: [{
      data: bookingData.eventTypes?.map(t => t.count) || [],
      backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(139, 92, 246, 0.5)'],
      borderColor: ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)', 'rgba(16, 185, 129, 1)', 'rgba(139, 92, 246, 1)'],
      borderWidth: 1
    }]
  };

  const statusChartData = {
    labels: bookingData.statusDistribution?.map(s => s._id) || [],
    datasets: [{
      data: bookingData.statusDistribution?.map(s => s.count) || [],
      backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(239, 68, 68, 0.5)', 'rgba(245, 158, 11, 0.5)'],
      borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)'],
      borderWidth: 1
    }]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <Building className="w-10 h-10 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Venues</h3>
              <p className="text-2xl font-bold">{summary.totalVenues || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <BarChart3 className="w-10 h-10 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Bookings</h3>
              <p className="text-2xl font-bold">{summary.totalBookings || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <IndianRupee   className="w-10 h-10 text-yellow-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Current Month Revenue</h3>
              <p className="text-2xl font-bold">₹{summary.currentMonthRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <Users className="w-10 h-10 text-purple-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Avg Booking Value</h3>
              <p className="text-2xl font-bold">₹{summary.avgBookingValue || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <Bar data={revenueChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Monthly Revenue' } } }} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Booking Trend</h3>
            <Bar data={bookingChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Monthly Bookings' } } }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Event Type Distribution</h3>
            <Pie data={eventTypeChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Event Types' } } }} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Booking Status Distribution</h3>
            <Doughnut data={statusChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Booking Status' } } }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Venues by Revenue</h3>
          <div className="space-y-4">
            {venueData.slice(0, 5).map(venue => (
              <div key={venue.venueId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-gray-600">{venue.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{venue.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{venue.totalBookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
