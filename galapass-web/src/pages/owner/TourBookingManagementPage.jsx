import React, { useState, useEffect } from 'react';
import {
    Calendar,
    DollarSign,
    Clock,
    TrendingUp,
    Download,
    RefreshCw,
    ArrowLeft,
    Plus
} from 'lucide-react';
import StatCard from "../../components/StatCard.jsx";
import BookingDetailsModal from "../../components/OwnerView/Bookings/BookingDetailsModal.jsx";
import BookingCard from "../../components/OwnerView/Bookings/BookingCard.jsx";
import BookingFilters from "../../components/OwnerView/Bookings/BookingFilter.jsx";
import useBookings from "../../hooks/UseBookings.js";
import {useAuth} from "../../contexts/AuthContext.jsx";

const mockStats = {
    totalBookings: 24,
    upcomingBookings: 8,
    totalRevenue: 12450.00,
    averageBookingValue: 518.75
};

const TourBookingManagementPage = () => {
    const { user } = useAuth();
    const ownerId = user?.id;

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [searchData, setSearchData] = useState({ checkIn: '' });
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { bookings, loading, error, refetch } = useBookings({
        ownerId: ownerId,
        status: activeFilter !== 'all' ? activeFilter.toUpperCase() : null,
        date: dateFilter || null,
        search: searchTerm || null
    });
    const filteredBookings = bookings;

    useEffect(() => {
        refetch();
    }, [activeFilter, searchTerm, dateFilter]);

    const handleCheckInSelect = (date) => {
        setSearchData(prev => ({ ...prev, checkIn: date }));
        setDateFilter(date);
        setShowCheckInCalendar(false);
    };

    const filterButtons = [
        { id: 'all', label: 'All Bookings', count: bookings.length },
        { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => !b.completed && b.status !== 'cancelled').length },
        { id: 'completed', label: 'Completed', count: bookings.filter(b => b.completed).length },
        { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
        { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Dashboard</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Manage Tour Bookings</h1>
                                <p className="text-gray-600">View and manage all your tour bookings</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Calendar}
                        title="Total Bookings"
                        value={mockStats.totalBookings}
                        subtitle="All time"
                        color="emerald"
                    />
                    <StatCard
                        icon={Clock}
                        title="Upcoming"
                        value={mockStats.upcomingBookings}
                        subtitle="Next 30 days"
                        color="blue"
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Total Revenue"
                        value={`$${mockStats.totalRevenue.toLocaleString()}`}
                        subtitle="All bookings"
                        color="green"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Avg. Booking"
                        value={`$${mockStats.averageBookingValue}`}
                        subtitle="Per booking"
                        color="purple"
                    />
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Filters and Search */}
                    <BookingFilters
                        filterButtons={filterButtons}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        showCheckInCalendar={showCheckInCalendar}
                        setShowCheckInCalendar={setShowCheckInCalendar}
                        handleCheckInSelect={handleCheckInSelect}
                        searchData={searchData}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />

                    {/* Bookings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                setSelectedBooking={setSelectedBooking}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                        </div>
                    )}

                    {/* Booking Details Modal (can be outside spacing block if it’s a portal/modal) */}
                    {selectedBooking && (
                        <BookingDetailsModal
                            booking={selectedBooking}
                            onClose={() => setSelectedBooking(null)}
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default TourBookingManagementPage;