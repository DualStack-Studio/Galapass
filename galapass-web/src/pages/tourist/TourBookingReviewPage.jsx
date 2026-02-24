import React, { useState } from 'react';
import {
    Star,
    MapPin,
    Calendar,
    Users,
    ChevronLeft,
    CreditCard,
    Lock,
    AlertCircle
} from 'lucide-react';
import {useNavigate} from "react-router-dom";

// --- MOCK DATA ---
// This data would typically be passed from the Tour Detail Page after the user clicks "Request to Book".
const bookingDetails = {
    tour: {
        id: 1,
        title: "Ultimate Galápagos Wildlife & Marine Reserve Tour",
        location: "Santa Cruz Island, Galápagos",
        rating: 4.92,
        reviewCount: 128,
        pricePerPerson: 350.00,
        mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    },
    booking: {
        date: '2025-07-28',
        guests: 2,
    }
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateString, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) => {
    if (!dateString) return "N/A";
    return new Date(dateString + 'T00:00:00-05:00').toLocaleDateString('en-US', options);
};

// --- MAIN PAGE COMPONENT ---
const BookingReviewPage = () => {
    const navigate = useNavigate();


    const { tour, booking } = bookingDetails;

    const basePrice = tour.pricePerPerson * booking.guests;
    const serviceFee = basePrice * 0.1; // Example 10% service fee
    const totalPrice = basePrice + serviceFee;

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* --- HEADER --- */}
                <div className="mb-8">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4">
                        Review and Confirm Your Booking
                    </h1>
                </div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. YOUR TRIP DETAILS */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Trip</h2>
                            <div className="flex space-x-4">
                                <img src={tour.mainImage} alt={tour.title} className="w-32 h-24 object-cover rounded-lg"/>
                                <div>
                                    <p className="text-gray-500 text-sm">Tour</p>
                                    <h3 className="font-bold text-gray-900">{tour.title}</h3>
                                    <div className="flex items-center space-x-1 text-sm mt-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="font-bold text-gray-800">{tour.rating}</span>
                                        <span className="text-gray-500">({tour.reviewCount} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-6 h-6 text-teal-600 mt-1"/>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Date</h4>
                                        <p className="text-gray-600">{formatDate(booking.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Users className="w-6 h-6 text-teal-600 mt-1"/>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Guests</h4>
                                        <p className="text-gray-600">{booking.guests} person</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. PAY WITH */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pay with</h2>
                            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="w-6 h-6 text-gray-700"/>
                                    <span className="font-medium">Credit or debit card</span>
                                </div>
                                <div className="flex space-x-1">
                                    <img src="https://ssl.gstatic.com/images/credit/visa.svg" alt="Visa" className="h-6"/>
                                    <img src="https://ssl.gstatic.com/images/credit/mastercard.svg" alt="Mastercard" className="h-6"/>
                                    <img src="https://ssl.gstatic.com/images/credit/amex.svg" alt="Amex" className="h-6"/>
                                </div>
                            </div>
                            <div className="mt-4 space-y-4">
                                <input type="text" placeholder="Card number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"/>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM / YY" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"/>
                                    <input type="text" placeholder="CVV" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"/>
                                </div>
                            </div>
                        </div>

                        {/* 3. CANCELLATION POLICY */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cancellation policy</h2>
                            <p className="text-gray-600">
                                Free cancellation before <span className="font-bold text-gray-800">{formatDate('2025-07-21')}</span>.
                                After that, this booking is non-refundable. <a href="#" className="text-teal-600 font-medium underline">Learn more</a>
                            </p>
                        </div>

                        {/* 4. FINAL AGREEMENT */}
                        <div className="mt-6">
                            <div className="flex items-start space-x-3 text-xs text-gray-500">
                                <AlertCircle className="w-8 h-8 text-gray-400 flex-shrink-0"/>
                                <p>I agree to the <a href="#" className="underline font-medium">Guest Terms of Service</a> and <a href="#" className="underline font-medium">Tour Rules</a>. I also acknowledge the <a href="#" className="underline font-medium">Cancellation Policy</a>.</p>
                            </div>
                            <button onClick={() => {navigate("/tourist/booking-confirmed")}} className="mt-6 w-full sm:w-auto flex items-center justify-center space-x-3 py-3 px-8 rounded-lg font-bold text-lg text-white transition-colors bg-teal-600 hover:bg-teal-700">
                                <Lock className="w-5 h-5"/>
                                <span>Confirm and Pay</span>
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (SUMMARY CARD) --- */}
                    <div className="lg:col-span-1 mt-10 lg:mt-0">
                        <div className="sticky top-8">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Price Details</h3>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>${tour.pricePerPerson.toFixed(2)} x {booking.guests} guests</span>
                                        <span>${basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service fee</span>
                                        <span>${serviceFee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center font-bold text-gray-900 text-lg">
                                        <span>Total (USD)</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingReviewPage;
