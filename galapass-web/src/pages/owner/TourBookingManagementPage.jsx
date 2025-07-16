import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, TrendingUp, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import StatCard from "../../components/StatCard.jsx";
import BookingDetailsModal from "../../components/OwnerView/Bookings/BookingDetailsModal.jsx";
import BookingCard from "../../components/OwnerView/Bookings/BookingCard.jsx";
import BookingFilters from "../../components/OwnerView/Bookings/BookingFilter.jsx";
import useBookings from "../../hooks/UseBookings.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useTranslation } from 'react-i18next';

const TourBookingManagementPage = () => {
    const { user } = useAuth();
    const ownerId = user?.id;
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const tourIdFromState = location.state?.tourId;
    const tourTitleFromState = location.state?.tourTitle;
    const isTourSpecificView = !!tourIdFromState;

    // State for filters
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // State for UI components
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // The hook is now called without any arguments
    const { bookings, stats, loading, error, fetchBookings, fetchStats } = useBookings();

    // This single useEffect handles all data fetching logic
    useEffect(() => {
        const status = activeFilter !== 'all' ? activeFilter.toUpperCase() : null;

        // Build the parameters object for the API call
        const params = {
            status: status,
            date: dateFilter || null,
            search: searchTerm || null,
        };

        if (isTourSpecificView) {
            // For a specific tour, add the tourId
            params.tourId = tourIdFromState;
        } else {
            // For the general owner view, add the ownerId and fetch stats
            params.ownerId = ownerId;
            fetchStats(ownerId);
        }

        // Call the single, flexible fetch function
        fetchBookings(params);

    }, [
        isTourSpecificView, tourIdFromState, ownerId, // View mode dependencies
        activeFilter, searchTerm, dateFilter, // Filter dependencies
        fetchBookings, fetchStats // Function dependencies from the hook
    ]);

    const handleCheckInSelect = (date) => {
        const dateObject = new Date(date);
        setDateFilter(dateObject.toISOString().split('T')[0]);
        setShowCheckInCalendar(false);
    };

    const handleSearch = () => setSearchTerm(searchInput);

    const handleRefresh = () => {
        // Clearing the filters will automatically trigger the useEffect to refetch data
        setActiveFilter('all');
        setSearchTerm('');
        setSearchInput('');
        setDateFilter('');
    };

    const handleClearDate = () => setDateFilter('');

    // Dynamically calculate the counts for the filter buttons
    const bookingCounts = useMemo(() => {
        if (isTourSpecificView) {
            // For a specific tour, calculate counts from the currently displayed bookings
            return {
                total: bookings.length,
                upcoming: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
                completed: bookings.filter(b => b.status === 'COMPLETED').length,
                pending: bookings.filter(b => b.status === 'PENDING').length,
                canceled: bookings.filter(b => b.status === 'CANCELLED').length,
            };
        }
        // For the general owner view, use the stats from the API
        return {
            total: stats?.totalBookings || 0,
            upcoming: stats?.upcomingBookings || 0,
            completed: stats?.completedBookings || 0,
            pending: stats?.pendingBookings || 0,
            canceled: stats?.cancelledBookings || 0,
        };
    }, [bookings, stats, isTourSpecificView]);

    const filterButtons = [
        { id: 'all', label: t('booking_filters.all_bookings'), count: bookingCounts.total },
        { id: 'upcoming', label: t('booking_filters.upcoming'), count: bookingCounts.upcoming },
        { id: 'completed', label: t('booking_filters.completed'), count: bookingCounts.completed },
        { id: 'pending', label: t('booking_filters.pending'), count: bookingCounts.pending },
        { id: 'canceled', label: t('booking_filters.canceled'), count: bookingCounts.canceled }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate("/owner/dashboard?tab=tours")} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                                <ArrowLeft className="h-5 w-5" />
                                <span>{t('booking_management.back')}</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isTourSpecificView ? t('booking_management.bookings_for', { tour: tourTitleFromState }) : t('booking_management.manage_all_bookings')}
                                </h1>
                                <p className="text-gray-600">
                                    {isTourSpecificView ? t('booking_management.filter_and_view') : t('booking_management.view_and_manage')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer">
                                <Download className="w-4 h-4" />
                                <span>{t('booking_management.export')}</span>
                            </button>
                            <button onClick={handleRefresh} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer">
                                <RefreshCw className="w-4 h-4" />
                                <span>{t('booking_management.refresh')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditionally render Stats section only for the general owner view */}
            {!isTourSpecificView && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats ? (
                            <>
                                <StatCard icon={Calendar} title={t('booking_management.total_bookings')} value={stats.totalBookings} subtitle={t('booking_management.all_time')} color="emerald" />
                                <StatCard icon={Clock} title={t('booking_management.upcoming')} value={stats.upcomingBookings} subtitle={t('booking_management.next_30_days')} color="blue" />
                                <StatCard icon={DollarSign} title={t('booking_management.total_revenue')} value={`$${stats.totalRevenue.toLocaleString()}`} subtitle={t('booking_management.all_bookings')} color="green" />
                                <StatCard icon={TrendingUp} title={t('booking_management.avg_booking')} value={`$${stats.averageBookingValue.toFixed(2)}`} subtitle={t('booking_management.per_booking')} color="purple" />
                            </>
                        ) : (<p>{t('booking_management.loading_stats')}</p>)}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Filters are now ALWAYS visible */}
                    <BookingFilters
                        filterButtons={filterButtons}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        searchTerm={searchInput}
                        setSearchTerm={setSearchInput}
                        handleSearch={handleSearch}
                        dateFilter={dateFilter}
                        showCheckInCalendar={showCheckInCalendar}
                        setShowCheckInCalendar={setShowCheckInCalendar}
                        handleCheckInSelect={handleCheckInSelect}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        handleClearDate={handleClearDate}
                    />

                    {/* Bookings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                setSelectedBooking={setSelectedBooking}
                            />
                        ))}
                    </div>

                    {bookings.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('booking_management.no_bookings_found')}</h3>
                            <p className="text-gray-500">{t('booking_management.try_adjusting_filters')}</p>
                        </div>
                    )}

                    {loading && <p className="text-center">{t('booking_management.loading_bookings')}</p>}

                    <BookingDetailsModal
                        isOpen={!!selectedBooking}
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                </div>
            </div>
        </div>
    );
};

export default TourBookingManagementPage;
