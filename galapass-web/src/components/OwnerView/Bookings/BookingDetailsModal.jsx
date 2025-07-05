import { CheckCircle, Clock, AlertCircle, X, MapPin, MessageSquare, User, Phone, Mail } from "lucide-react";
import React from "react";

const getStatusColor = (status, completed) => {
    if (completed) return "bg-green-100 text-green-800";
    switch (status) {
        case "confirmed":
            return "bg-blue-100 text-blue-800";
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "cancelled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle className="w-4 h-4 mr-1" />;
    switch (status) {
        case "confirmed":
            return <CheckCircle className="w-4 h-4 mr-1" />;
        case "pending":
            return <Clock className="w-4 h-4 mr-1" />;
        case "cancelled":
            return <AlertCircle className="w-4 h-4 mr-1" />;
        default:
            return null;
    }
};

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/30 transition-opacity bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
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
                                    src={booking.tour.photoUrls[0]}
                                    alt={booking.tour.title}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{booking.tour.title}</h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {booking.tour.location}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Price per person: ${booking.tour.price}
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
                                    {booking.guides.map((guide, index) => (
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
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-medium text-gray-900">{guide.name}</h4>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {guide.email}
                                                    </div>
                                                </div>
                                                {guide.languages && guide.languages.length > 0 && (
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <span className="text-xs text-gray-500">Languages:</span>
                                                        {guide.languages.map((lang, i) => (
                                                            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                {lang}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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
                                {booking.tourists.map((tourist, index) => (
                                    <div key={tourist.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div
                                            key={tourist.id}
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
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {tourist.name || 'Unknown Guest'}
                                            </p>
                                            <p className="text-sm text-gray-500">{tourist.email || 'Unknown Guest'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                                Contact Guest
                            </button>
                            {booking.guides && booking.guides.length > 0 && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                                    Contact Guides
                                </button>
                            )}
                            {booking.status === 'pending' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    Confirm Booking
                                </button>
                            )}
                            {!booking.completed && booking.status !== 'cancelled' && (
                                <button className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;