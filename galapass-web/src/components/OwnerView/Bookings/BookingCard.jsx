import {AlertCircle, Calendar, CheckCircle, Clock, User, MapPin} from "lucide-react";
import React from "react";


const getStatusColor = (status, completed) => {
    if (completed) return 'bg-green-100 text-green-800';
    switch (status) {
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle className="w-4 h-4" />;
    switch (status) {
        case 'confirmed': return <Calendar className="w-4 h-4" />;
        case 'pending': return <Clock className="w-4 h-4" />;
        case 'cancelled': return <AlertCircle className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
    }
};

const BookingCard = ({ booking, setSelectedBooking }) => {
    const bookingDate = new Date(booking.date);
    const bookedAtDate = booking.bookedAt ? new Date(booking.bookedAt) : null;

    // Defensively get the tour object to prevent errors if data is missing
    const tour = booking.tourDate?.tour;

    // If there's no tour data, don't render the card to avoid crashing.
    if (!tour) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <img
                                // Use a placeholder if no photo is available
                                src={tour.photoUrls && tour.photoUrls.length > 0 ? tour.photoUrls[0] : 'https://placehold.co/48x48/e2e8f0/64748b?text=Tour'}
                                alt={tour.title}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {tour.location}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status, booking.completed)}`}>
                            {getStatusIcon(booking.status, booking.completed)}
                            <span className="ml-1 capitalize">
                                {booking.completed ? 'Completed' : booking.status}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Assigned Guides Preview */}
                {booking.guides && booking.guides.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Assigned Guides</span>
                            </div>
                            <div className="flex -space-x-2">
                                {booking.guides.slice(0, 2).map((guide, index) => (
                                    <div key={guide.id} className="relative">
                                        {guide.profilePhoto ? (
                                            <img
                                                src={guide.profilePhoto}
                                                alt={guide.name}
                                                className="w-6 h-6 rounded-full object-cover border-2 border-white"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white">
                                                <span className="text-xs font-medium text-blue-600">
                                                    {guide.name ? guide.name.charAt(0) : '?'}
                                                </span>
                                            </div>
                                        )}
                                        {guide.isLead && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-bold text-yellow-800">★</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {booking.guides.length > 2 && (
                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                                        +{booking.guides.length - 2}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-1">
                            <span className="text-xs text-blue-700">
                                {booking.guides[0]?.name}
                                {booking.guides.length > 1 && ` +${booking.guides.length - 1} more`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Booking Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm my-4 border-t border-b border-gray-100 py-4">
                    <div className="text-gray-600">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="font-bold text-gray-800 mt-1">{bookingDate.toLocaleDateString()}</p>
                    </div>
                    <div className="text-gray-600">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Guests</p>
                        <p className="font-bold text-gray-800 mt-1">{booking.numberOfPeople}</p>
                    </div>
                    <div className="text-gray-600">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue</p>
                        <p className="font-bold text-gray-800 mt-1">${booking.totalPaid.toFixed(2)}</p>
                    </div>
                    <div className="text-gray-600">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Booked</p>
                        <p className="font-bold text-gray-800 mt-1">{bookedAtDate ? bookedAtDate.toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            {booking.tourists.slice(0, 3).map((tourist, index) => (
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
                            ))}
                            {booking.tourists.length > 3 && (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                                    +{booking.tourists.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-gray-600">
                            {booking.tourists[0]?.name}
                            {booking.tourists.length > 1 && ` +${booking.tourists.length - 1} more`}
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1 cursor-pointer"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
