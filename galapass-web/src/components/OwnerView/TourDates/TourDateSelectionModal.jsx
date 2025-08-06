// src/components/OwnerView/TourDates/TourDateSelectionModal.jsx
import React from 'react';
import { X, Plus, Clock, Users, DollarSign, Calendar, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TourDateSelectionModal = ({
                                    isOpen,
                                    onClose,
                                    selectedDate,
                                    tourDates,
                                    onCreateNew,
                                    onEdit
                                }) => {
    const { t } = useTranslation();

    if (!isOpen || !selectedDate) return null;

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTotalBookings = (tourDate) => {
        return (tourDate.bookings || []).reduce((sum, booking) => sum + (booking.numberOfPeople || 0), 0);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{t('tour_dates.select_tour_date')}</h3>
                        <p className="text-gray-600 mt-1">{formatDate(selectedDate)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Create New Button */}
                <button
                    onClick={onCreateNew}
                    className="w-full mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg cursor-pointer"
                >
                    <Plus size={20} />
                    <span className="text-lg font-semibold">{t('tour_dates.create_new_tour_date')}</span>
                </button>

                {/* Existing Tour Dates */}
                {tourDates.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('tour_dates.existing_tour_dates')} ({tourDates.length})
                        </h4>
                        <div className="space-y-3">
                            {tourDates.map((tourDate) => {
                                const totalBookings = getTotalBookings(tourDate);
                                const availableSpots = tourDate.maxGuests - totalBookings;
                                const isFullyBooked = availableSpots <= 0;

                                return (
                                    <div
                                        key={tourDate.id}
                                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                        onClick={() => onEdit(tourDate)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div className="flex items-center space-x-2 text-emerald-600">
                                                        <Clock size={18} />
                                                        <span className="font-semibold text-lg">
                                                            {formatTime(tourDate.date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            isFullyBooked
                                                                ? 'bg-red-100 text-red-800'
                                                                : tourDate.available
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {isFullyBooked
                                                                ? t('tour_dates.fully_booked')
                                                                : tourDate.available
                                                                    ? t('tour_dates.available')
                                                                    : t('tour_dates.unavailable')
                                                            }
                                                        </div>
                                                        {(!tourDate.guides || tourDate.guides.length === 0) && (
                                                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                                                {t('tour_dates.no_guide_added')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <DollarSign size={16} />
                                                        <span className="font-medium">${tourDate.price}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Users size={16} />
                                                        <span className="font-medium">
                                                            {totalBookings}/{tourDate.maxGuests}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Calendar size={16} />
                                                        <span className="font-medium">
                                                            {availableSpots} {t('tour_dates.spots_left')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Edit3 size={20} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tourDates.length === 0 && (
                    <div className="text-center py-8">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">{t('tour_dates.no_tour_dates_for_date')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('tour_dates.create_first_tour_date')}</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default TourDateSelectionModal;