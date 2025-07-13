import React from 'react';
import {
    CheckCircle,
    Star,
    MapPin,
    Calendar,
    Users,
    ChevronRight,
    Mail,
    Phone,
    Sun,
    Wind,
    Camera
} from 'lucide-react';

// --- MOCK DATA ---
// This data would be the result of a successful booking transaction.
const confirmedBookingDetails = {
    bookingId: "G7X3-8K2P",
    user: {
        name: "Alex Johnson",
        email: "alex.j@example.com",
    },
    tour: {
        id: 1,
        title: "Ultimate Galápagos Wildlife & Marine Reserve Tour",
        location: "Santa Cruz Island, Galápagos",
        mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        guide: {
            name: "Carlos Rodriguez",
            profilePhotoUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop",
        }
    },
    booking: {
        date: '2025-07-28',
        guests: 2,
        totalPaid: 770.00
    }
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateString, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) => {
    if (!dateString) return "N/A";
    return new Date(dateString + 'T00:00:00-05:00').toLocaleDateString('en-US', options);
};

// --- MAIN PAGE COMPONENT ---
const BookingConfirmationPage = () => {
    const { tour, booking, user, bookingId } = confirmedBookingDetails;

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16 text-center">

                {/* --- HEADER --- */}
                <div className="flex justify-center items-center mb-4">
                    <CheckCircle className="w-16 h-16 text-teal-500" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    You're all set!
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Your booking is confirmed. Get ready for an adventure in the Galápagos!
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Booking ID: <span className="font-medium text-gray-700">{bookingId}</span>
                </p>

                {/* --- TRIP SUMMARY CARD --- */}
                <div className="mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-lg text-left">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={tour.mainImage} alt={tour.title} className="w-full sm:w-48 h-40 object-cover rounded-lg"/>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{tour.title}</h2>
                            <div className="mt-4 space-y-3 text-gray-700">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-teal-600"/>
                                    <span className="font-medium">{formatDate(booking.date)}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-teal-600"/>
                                    <span className="font-medium">{booking.guests} Guests</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-teal-600"/>
                                    <span className="font-medium">{tour.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- WHAT'S NEXT SECTION --- */}
                <div className="mt-10 text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">What's Next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Confirmation Email */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl flex items-start space-x-4">
                            <Mail className="w-8 h-8 text-teal-500 flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-gray-900">Check your email</h4>
                                <p className="text-gray-600 text-sm">We've sent a confirmation and receipt to <span className="font-medium">{user.email}</span>.</p>
                            </div>
                        </div>

                        {/* Your Guide */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl flex items-start space-x-4">
                            <img src={tour.guide.profilePhotoUrl} alt={tour.guide.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                                <h4 className="font-bold text-gray-900">Your guide is {tour.guide.name}</h4>
                                <p className="text-gray-600 text-sm">Have a question? <a href="#" className="text-teal-600 font-medium underline">Contact your host</a>.</p>
                            </div>
                        </div>

                        {/* What to Bring */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl md:col-span-2">
                            <h4 className="font-bold text-gray-900 mb-3">Recommended to bring</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center space-x-2"><Sun className="w-5 h-5 text-yellow-500"/><span className="text-gray-700">Sunscreen & Hat</span></div>
                                <div className="flex items-center space-x-2"><Wind className="w-5 h-5 text-blue-500"/><span className="text-gray-700">Light Jacket</span></div>
                                <div className="flex items-center space-x-2"><Camera className="w-5 h-5 text-gray-500"/><span className="text-gray-700">Camera</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-colors bg-teal-600 hover:bg-teal-700">
                        <span>Manage Booking</span>
                        <ChevronRight className="w-4 h-4"/>
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors">
                        Explore More Tours
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingConfirmationPage;
