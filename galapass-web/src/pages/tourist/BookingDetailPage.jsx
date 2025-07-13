import React from 'react';
import { Star, MapPin, Calendar, Users, ChevronLeft, Phone, MessageSquare, FileText, CreditCard } from 'lucide-react';

// --- MOCK DATA ---
// This data would be fetched for a specific booking ID.
const bookingDetails = {
    id: "G7X3-8K2P",
    status: "CONFIRMED",
    tour: {
        id: 1,
        title: "Ultimate Wildlife & Marine Tour",
        location: "Santa Cruz Island, Galápagos",
        mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    },
    guide: {
        name: "Carlos Rodriguez",
        profilePhotoUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop",
        phone: "+593 99 123 4567"
    },
    booking: {
        date: '2025-07-28',
        guests: 2,
        totalPaid: 770.00,
        pricePerPerson: 350.00,
        serviceFee: 70.00
    },
    payment: {
        cardType: "Visa",
        last4: "4242",
        paymentDate: "2025-06-18"
    },
    meetingPoint: {
        address: "Puerto Ayora Main Dock, Av. Charles Darwin, Santa Cruz",
        instructions: "Please meet Carlos by the main pier entrance, near the 'Galápagos' sign. He will be wearing a blue shirt with the 'Galápagos Premier' logo. Please arrive 15 minutes early."
    }
};


// --- HELPER & CHILD COMPONENTS ---
const formatDate = (dateString, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) => {
    if (!dateString) return "N/A";
    return new Date(dateString + 'T00:00:00-05:00').toLocaleDateString('en-US', options);
};

const InfoSection = ({ title, children }) => (
    <div className="border-t border-gray-200 py-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);

const PriceSummaryCard = ({ booking, tour, payment }) => {
    const basePrice = booking.pricePerPerson * booking.guests;
    return (
        <div className="sticky top-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex space-x-4">
                    <img src={tour.mainImage} alt={tour.title} className="w-28 h-20 object-cover rounded-lg"/>
                    <div>
                        <p className="text-sm text-gray-500">{tour.location}</p>
                        <h3 className="font-bold text-gray-900 leading-tight">{tour.title}</h3>
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-6 space-y-3">
                    <h4 className="font-bold text-gray-800">Price Details</h4>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>${booking.pricePerPerson.toFixed(2)} x {booking.guests} guests</span>
                        <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Service fee</span>
                        <span>${booking.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-gray-900 text-lg pt-2 border-t border-gray-100 mt-2">
                        <span>Total (USD)</span>
                        <span>${booking.totalPaid.toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600">
                    Paid with {payment.cardType} ending in {payment.last4} on {formatDate(payment.paymentDate, {month: 'long', day: 'numeric', year: 'numeric'})}.
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const BookingDetailPage = () => {
    const { tour, booking, guide, payment, meetingPoint, id, status } = bookingDetails;
    const isCompleted = status === 'COMPLETED'; // Example logic for conditional UI

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* Header */}
                <div className="mb-8">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to Bookings</span>
                    </button>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4">
                        Your booking for {tour.location}
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

                    {/* Left Column - Booking Details */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{formatDate(booking.date)}</h2>
                                    <p className="text-gray-600">{booking.guests} Guests</p>
                                </div>
                                <span className={`mt-2 sm:mt-0 text-sm font-bold px-3 py-1 rounded-full ${status === 'CONFIRMED' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {status}
                                </span>
                            </div>

                            <InfoSection title="Your Guide">
                                <div className="flex items-center space-x-4">
                                    <img src={guide.profilePhotoUrl} alt={guide.name} className="w-16 h-16 rounded-full object-cover"/>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-lg text-gray-900">{guide.name}</h4>
                                        <div className="flex space-x-3 mt-1">
                                            <a href={`tel:${guide.phone}`} className="flex items-center space-x-1.5 text-sm text-teal-600 font-medium hover:underline">
                                                <Phone size={14} /><span>Call</span>
                                            </a>
                                            <a href="#" className="flex items-center space-x-1.5 text-sm text-teal-600 font-medium hover:underline">
                                                <MessageSquare size={14} /><span>Message</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </InfoSection>

                            <InfoSection title="Meeting Point">
                                <p className="font-semibold text-gray-800">{meetingPoint.address}</p>
                                <p className="text-gray-600 mt-2">{meetingPoint.instructions}</p>
                                <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                    [Map Placeholder]
                                </div>
                            </InfoSection>

                            <InfoSection title="Actions">
                                <div className="flex flex-wrap gap-4">
                                    <button className="flex-1 min-w-[150px] text-center px-4 py-3 rounded-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors">View Tour Listing</button>
                                    <button className="flex-1 min-w-[150px] text-center px-4 py-3 rounded-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors">Get Directions</button>
                                    <button className="flex-1 min-w-[150px] text-center px-4 py-3 rounded-lg font-bold text-red-700 bg-red-50 border-2 border-red-200 hover:bg-red-100 transition-colors">Cancel Booking</button>
                                </div>
                            </InfoSection>
                        </div>
                    </div>

                    {/* Right Column - Price Summary */}
                    <div className="lg:col-span-1 mt-10 lg:mt-0">
                        <PriceSummaryCard booking={booking} tour={tour} payment={payment} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;
