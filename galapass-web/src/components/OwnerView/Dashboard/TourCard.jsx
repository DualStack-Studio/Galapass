import { Star } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const TourCard = ({ tour }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleViewBookings = () => {
        navigate('/owner/manage-bookings', {
            state: {
                tourId: tour.id,
                tourTitle: tour.title
            }
        });
    };

    const coverImage = tour.media?.find(m => m.type === 'IMAGE').url;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image Section */}
            <div className="relative h-48 w-full">
                <img
                    src={coverImage || '/images/galapassLogo.png'}
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
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {tour.title || 'Untitled Tour'}
                    </h3>
                    <div className="flex items-center ml-2 flex-shrink-0">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                            {tour.rating != null ? tour.rating : t('not_available')}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t('price_per_person', 'Price per person')}</span>
                        <span className="text-lg font-semibold text-emerald-600">
                            ${tour.price != null ? tour.price : '0'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t('total_bookings', 'Total bookings')}</span>
                        <span className="text-sm font-medium text-gray-900">
                            {tour.totalBookings != null ? tour.totalBookings : '0'}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
                    <div className="flex space-x-2 ml-auto">
                        <button
                            onClick={() => navigate(`/owner/add-tour-date/${tour.id}`)}
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer"
                        >
                            {t('dates', 'Dates')}
                        </button>
                        <button
                            onClick={handleViewBookings}
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer"
                        >
                            {t('bookings', 'Bookings')}
                        </button>
                        <button
                            onClick={() => navigate(`/owner/edit-tour/${tour.id}`)}
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer"
                        >
                            {t('edit', 'Edit')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourCard;