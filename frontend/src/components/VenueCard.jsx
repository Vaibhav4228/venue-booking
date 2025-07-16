import React, { useState } from 'react';
import { MapPin, Users, IndianRupee  , Star, Calendar } from 'lucide-react';
import BookingModal from './BookingModal';

const VenueCard = ({ venue, onBook }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="relative overflow-hidden">
          <img
            src={venue.image || 'https://picsum.photos/400/300?random=1'}
            alt={venue.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 3}</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Available
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {venue.name}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{venue.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">Up to {venue.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee  className="w-4 h-4" />
              <span className="text-sm font-semibold text-blue-600">₹{venue.pricePerDay.toFixed(2)}/day</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {venue.description}
          </p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h4>
            <div className="flex flex-wrap gap-1">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {venue.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>
        </div>
      </div>
      <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onBook={onBook}
          venue={venue}
        />
    </>
  );
};

export default VenueCard;
