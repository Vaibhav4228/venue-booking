import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { venueApi } from '../services/venueApi';

const VenueManagementModal = ({ isOpen, onClose, venue }) => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && venue) {
      fetchData();
    }
  }, [isOpen, venue]);

  const fetchData = async () => {
    try {
      const [dates, venueBookings] = await Promise.all([
        venueApi.getBlockedDates(venue._id),
        venueApi.getVenueBookings(venue._id)
      ]);
      setUnavailableDates(dates);
      setBookings(venueBookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    }
  };

  const handleAddDate = async () => {
    if (!newDate) return;
    try {
      const updatedDates = [...unavailableDates, format(new Date(newDate), 'yyyy-MM-dd')];
      await venueApi.updateAvailability(venue._id, updatedDates);
      setUnavailableDates(updatedDates);
      setNewDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
    }
  };

  const handleRemoveDate = async (date) => {
    try {
      const updatedDates = unavailableDates.filter(d => d !== date);
      await venueApi.updateAvailability(venue._id, updatedDates);
      setUnavailableDates(updatedDates);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Manage {venue.name}</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Blocked Dates</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleAddDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {unavailableDates.map((date, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{format(parseISO(date), 'PPP')}</span>
                <button
                  onClick={() => handleRemoveDate(date)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings for this venue.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map(booking => (
                <li key={booking._id} className="border-b py-2">
                  <p>{booking.customerName} - {booking.eventType}</p>
                  <p className="text-sm text-gray-600">{format(parseISO(booking.date), 'PPP')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueManagementModal;
