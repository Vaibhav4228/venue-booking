import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' ? local : prod;

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const venueApi = {

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  // Venues
  getAllVenues: async () => {
    const response = await api.get('/venues');
    return response.data;
  },

  addVenue: async (venueData) => {
    const response = await api.post('/venues', {
      ...venueData,
      capacity: parseInt(venueData.capacity),
      pricePerDay: parseInt(venueData.pricePerDay),
      amenities: venueData.amenities.filter(a => a.trim()),
      unavailableDates: venueData.unavailableDates || []
    });
    return response.data;
  },

  getBlockedDates: async (venueId) => {
    const response = await api.get(`/venues/${venueId}/blocked-dates`);
    return response.data;
  },

  updateAvailability: async (venueId, unavailableDates) => {
    const response = await api.patch(`/venues/${venueId}/availability`, { unavailableDates });
    return response.data;
  },

  getVenueBookings: async (venueId) => {
    const response = await api.get(`/venues/${venueId}/bookings`);
    return response.data;
  },

  // Bookings
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  bookVenue: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Analytics
  getAnalyticsSummary: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getRevenueAnalytics: async (period) => {
    const response = await api.get(`/analytics/revenue?period=${period}`);
    return response.data;
  },

  getBookingAnalytics: async (period) => {
    const response = await api.get(`/analytics/bookings?period=${period}`);
    return response.data;
  },

  getVenueAnalytics: async () => {
    const response = await api.get('/analytics/venues');
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await api.get('/analytics/customers');
    return response.data;
  }
};