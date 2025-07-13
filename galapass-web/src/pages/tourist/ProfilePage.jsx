import React, { useState } from 'react';
import { Star, MapPin, Calendar, Users, Heart, Edit, ChevronRight, MessageSquare, Award, Briefcase } from 'lucide-react';

// --- MOCK DATA ---
const userProfileData = {
    user: {
        name: "Alex Johnson",
        email: "alex.j@example.com",
        profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        joinDate: "2024-03-15",
    },
    stats: {
        totalBookings: 4,
        reviewsWritten: 2,
        toursFavorited: 3,
    },
    nextBooking: {
        id: 1,
        title: "Ultimate Wildlife & Marine Tour",
        location: "Santa Cruz, Galápagos",
        date: "2025-07-28",
        photoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    },
    favoriteTours: [
        { id: 3, title: "Kicker Rock Snorkeling & Diving", rating: 4.9, photoUrl: "https://images.unsplash.com/photo-1605548109197-9de50a634b33?q=80&w=1974&auto=format&fit=crop" },
        { id: 2, title: "Volcanic Peaks Hiking Adventure", rating: 4.8, photoUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" },
        { id: 5, title: "Española Island Photography Tour", rating: 4.9, photoUrl: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?q=80&w=2127&auto=format&fit=crop" },
    ],
    bookingHistory: [
        { id: 101, title: "Isabela Island Kayaking", date: "2025-05-20", status: "Completed" },
        { id: 102, title: "North Seymour Birdwatching", date: "2025-02-11", status: "Completed" },
    ],
    userReviews: [
        { id: 201, tourTitle: "Isabela Island Kayaking", rating: 5, comment: "Absolutely serene and beautiful experience. Our guide was fantastic and we saw so many penguins!", date: "2025-05-22" },
    ]
};

// --- HELPER & CHILD COMPONENTS ---

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ProfileCard = ({ user, stats }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg text-center">
        <img src={user.profilePhotoUrl} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-4 ring-4 ring-white shadow-md" />
        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-500">Joined in {new Date(user.joinDate).getFullYear()}</p>
        <button className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-bold transition-colors">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
        </button>
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-left">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3"><Briefcase className="w-5 h-5 text-teal-600" /><span className="font-medium">Total Bookings</span></div>
                <span className="font-bold text-lg">{stats.totalBookings}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3"><MessageSquare className="w-5 h-5 text-teal-600" /><span className="font-medium">Reviews Written</span></div>
                <span className="font-bold text-lg">{stats.reviewsWritten}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3"><Heart className="w-5 h-5 text-teal-600" /><span className="font-medium">Tours Favorited</span></div>
                <span className="font-bold text-lg">{stats.toursFavorited}</span>
            </div>
        </div>
    </div>
);

const DashboardSection = ({ title, children, viewAllLink = "#" }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <a href={viewAllLink} className="flex items-center space-x-1 text-sm font-bold text-teal-600 hover:text-teal-800 transition-colors">
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
            </a>
        </div>
        {children}
    </div>
);

// --- MAIN PAGE COMPONENT ---
const UserProfilePage = () => {
    const { user, stats, nextBooking, favoriteTours, bookingHistory, userReviews } = userProfileData;

    return (
        <div className="bg-white font-sans antialiased">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <ProfileCard user={user} stats={stats} />
                        </div>
                    </div>

                    {/* Right Column - Dashboard Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Next Trip Section */}
                        <DashboardSection title="Your Next Trip">
                            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                                <img src={nextBooking.photoUrl} alt={nextBooking.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <p className="text-xs font-bold text-teal-600 uppercase">UPCOMING</p>
                                    <h4 className="text-lg font-bold text-gray-900 mt-1">{nextBooking.title}</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{formatDate(nextBooking.date)}</span></div>
                                        <div className="flex items-center space-x-2"><MapPin className="w-4 h-4" /><span>{nextBooking.location}</span></div>
                                    </div>
                                </div>
                            </div>
                        </DashboardSection>

                        {/* Favorite Tours Section */}
                        <DashboardSection title="Favorite Tours">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {favoriteTours.slice(0, 2).map(tour => (
                                    <div key={tour.id} className="group relative rounded-xl overflow-hidden cursor-pointer">
                                        <img src={tour.photoUrl} alt={tour.title} className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-3 text-white">
                                            <h5 className="font-bold text-sm">{tour.title}</h5>
                                            <div className="flex items-center space-x-1 text-xs"><Star className="w-3 h-3 fill-current" /><span>{tour.rating}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardSection>

                        {/* Booking History Section */}
                        <DashboardSection title="Booking History">
                            <ul className="space-y-3">
                                {bookingHistory.map(booking => (
                                    <li key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-bold text-gray-800">{booking.title}</p>
                                            <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full">{booking.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </DashboardSection>

                        {/* My Reviews Section */}
                        <DashboardSection title="Your Reviews">
                            <ul className="space-y-4">
                                {userReviews.map(review => (
                                    <li key={review.id} className="p-4 border border-gray-200 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-gray-800">{review.tourTitle}</p>
                                            <div className="flex items-center space-x-1 text-sm font-medium">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span>{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                                    </li>
                                ))}
                            </ul>
                        </DashboardSection>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
