import { Star, ClipboardList } from "lucide-react";
import React from "react";

const GuideTourCard = ({ tour, onViewBookings }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image Section */}
        <div className="relative h-48 w-full">
            <img
                src={(tour.photoUrls && tour.photoUrls[0]) || '/images/galapassLogo.png'}
                alt={tour.title || 'Tour Image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/galapassLogo.png';
                }}
            />
            <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 backdrop-blur-sm bg-opacity-90">
                    {tour.status || 'N/A'}
                </span>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {tour.title || 'Untitled Tour'}
                </h3>
                <div className="flex items-center ml-2 flex-shrink-0">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                        {tour.rating != null ? tour.rating : 'N/A'}
                    </span>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Price:</strong> ${tour.price || 0} per person</p>
                <p><strong>Bookings:</strong> {tour.totalBookings || 0}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
                // In GuideTourCard.jsx
                ...
                <button
                    onClick={() => onViewBookings(tour)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                    <ClipboardList className="w-4 h-4" />
                    View Bookings
                </button>
                ...

            </div>
        </div>
    </div>
);

export default GuideTourCard;
