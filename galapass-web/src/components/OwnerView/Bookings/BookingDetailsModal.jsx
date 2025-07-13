import { CheckCircle, Clock, AlertCircle, X, MapPin, User, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import {convertLocationName} from "../../../api/tourApi.js";

// Helper functions remain the same
const getStatusColor = (status, completed) => {
    if (completed) return "bg-green-100 text-green-800";
    switch (status) {
        case "CONFIRMED":
            return "bg-blue-100 text-blue-800";
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "CANCELED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle className="w-4 h-4 mr-1" />;
    switch (status) {
        case "CONFIRMED":
            return <CheckCircle className="w-4 h-4 mr-1" />;
        case "PENDING":
            return <Clock className="w-4 h-4 mr-1" />;
        case "CANCELED":
            return <AlertCircle className="w-4 h-4 mr-1" />;
        default:
            return null;
    }
};


const BookingDetailsModal = ({ isOpen, booking, onClose }) => {
    // 1. Add state and effect for animation timing
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 2. Update render condition
    if (!isVisible || !booking) return null;

    const tour = booking.tourDate?.tour;
    if (!tour) return null; // Keep this check for data integrity

    return (
        // 3. Conditionally apply animations
        <div className={`fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}>
            <div className={`bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isOpen ? 'animate-slide-up' : 'animate-slide-down'}`}>
                <div className="p-6">
                    {/* Modal content remains the same... */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6 cursor-pointer" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Tour Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tour Information</h3>
                            <div className="flex items-start space-x-4">
                                <img
                                    src={tour.media?.find(m => m.type === 'IMAGE').url || 'as'}
                                    alt={tour.title}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{tour.title}</h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {convertLocationName(tour.location)}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Price per person: ${tour.price}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tour Date</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(booking.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Number of Guests</p>
                                    <p className="font-medium text-gray-900">{booking.numberOfPeople}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-medium text-gray-900">${booking.totalPaid}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status, booking.completed)}`}>
                                        {getStatusIcon(booking.status, booking.completed)}
                                        <span className="ml-1 capitalize">
                                            {booking.completed ? 'Completed' : booking.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Guides */}
                        {booking.guides && booking.guides.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assigned Guides</h3>
                                <div className="space-y-3">
                                    {booking.guides.map((guide) => (
                                        <div key={guide.id} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="relative">
                                                {guide.profilePhoto ? (
                                                    <img
                                                        src={guide.profilePhoto}
                                                        alt={guide.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{guide.name}</h4>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {guide.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Guest Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h3>
                            <div className="space-y-3">
                                {booking.tourists.map((tourist) => (
                                    <div key={tourist.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div
                                            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white overflow-hidden"
                                        >
                                            {tourist.profilePhoto ? (
                                                <img
                                                    src={tourist.profilePhoto}
                                                    alt={tourist.name || 'Guest'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span>{tourist.name?.charAt(0) || '?'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{tourist.name || 'Unknown Guest'}</p>
                                            <p className="text-sm text-gray-500">{tourist.email || 'No email'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="flex space-x-3">
                        {booking.status === 'PENDING' && (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Confirm Booking
                            </button>
                        )}
                        {booking.status !== 'CANCELED' && (
                            <button className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* 4. Add the CSS animations */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-out { animation: fade-out 0.3s ease-out forwards; }
                
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                
                @keyframes slide-down { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default BookingDetailsModal;