import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { venueApi } from '../services/venueApi';
import { Calendar, User, Mail, Phone, Tag, X, Check } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, onBook, venue }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    eventType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ customerName: '', email: '', phone: '', date: '', eventType: '' });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('Please log in');

      const bookingData = {
        venueId: venue?._id || '',
        venueName: venue?.name || '',
        userId: user.id,
        totalAmount: venue?.pricePerDay || 0,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        date: format(new Date(formData.date), 'yyyy-MM-dd'),
        eventType: formData.eventType
      };

      await venueApi.bookVenue(bookingData);
      setSuccess(true);
      onBook?.(bookingData);

      setTimeout(() => {
        onClose?.();
        setSuccess(false);
        setFormData({ customerName: '', email: '', phone: '', date: '', eventType: '' });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book venue you need to login first');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        // Added 'mx-auto' and adjusted 'max-w-md' and 'w-full' for better centering
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto my-auto max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Book {venue?.name || 'Venue'}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Fill in your details to book this venue</p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your venue has been successfully booked.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Date</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Type</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select event type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday Party</option>
                      <option value="Corporate">Corporate Event</option>
                      <option value="Conference">Conference</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{(venue?.pricePerDay || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">For 1 day booking</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;