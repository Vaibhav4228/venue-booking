import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { venueApi } from '../services/venueApi';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('Please log in');
      const bookingsData = await venueApi.getUserBookings(user.id);
      setBookings(bookingsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">You have no bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.venueName}</h3>
                    <p className="text-sm text-gray-600">Event: {booking.eventType}</p>
                    <p className="text-sm text-gray-600">Customer: {booking.customerName}</p>
                    <p className="text-sm text-gray-600">Email: {booking.email}</p>
                    <p className="text-sm text-gray-600">Phone: {booking.phone}</p>
                    <p className="text-sm text-gray-600">Status: {booking.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(booking.date), 'PPP')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booked on {format(new Date(booking.createdAt), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
