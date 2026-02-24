import React, { useEffect, useState, useRef } from 'react';
import { Building2, MapPin, Clock, History, ClipboardList, Check, X, Star } from 'lucide-react';
import { useGuideDashboard } from '../../hooks/useGuideDashboard.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import GuideCompanyCard from '../../components/GuideView/Dashboard/GuideCompanyCard.jsx';
import GuideTourCard from '../../components/GuideView/Dashboard/GuideTourCard.jsx';
import InvitationCard from '../../components/GuideView/Invitation/InvitationCard.jsx';
import BookingModal from '../../components/GuideView/Booking/BookingModal.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import BookingFilters from '../../components/OwnerView/Bookings/BookingFilter.jsx';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../../config.js';

const GuideDashboardPage = () => {
    const { user } = useAuth();
    const guideId = user?.id;
    const [activeTab, setActiveTab] = useState('companies');
    const [activeFilter, setActiveFilter] = useState('CONFIRMED');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(null);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState([]);

    const {
        companies,
        upcomingTours,
        activeTours,
        completedTours,
        tourHistory,
        invitations,
        stats,
        loading,
        error,
        refetch
    } = useGuideDashboard(guideId);

    const handleViewBookings = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/guides/${guideId}/bookings`, {
                credentials: 'include'
            });
            const data = await res.json();
            setSelectedBookings(data);
            setModalOpen(true);
        } catch (err) {
            toast.error("Failed to load guide bookings");
        }
    };

    const handleAccept = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/invitations/${id}/accept`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error();
            toast.success('Invitation accepted');
            await refetch();
        } catch {
            toast.error('Failed to accept invitation');
        }
    };

    const handleDecline = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/invitations/${id}/decline`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error();
            toast.success('Invitation declined');
            await refetch();
        } catch {
            toast.error('Failed to decline invitation');
        }
    };

    const allTours = [...upcomingTours, ...activeTours, ...completedTours, ...tourHistory];
    const uniqueTours = allTours.filter((tour, idx, self) => self.findIndex(t => t.id === tour.id) === idx);

    const filteredBookings = uniqueTours.filter(t => {
        const matchesStatus = activeFilter === 'ALL' || t.status === activeFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = dateFilter ? new Date(t.startDate).toDateString() === new Date(dateFilter).toDateString() : true;
        return matchesStatus && matchesSearch && matchesDate;
    });

    const filterButtons = [
        { id: 'ALL', label: 'All', count: uniqueTours.length },
        { id: 'CONFIRMED', label: 'Confirmed', count: uniqueTours.filter(t => t.status === 'CONFIRMED').length },
        { id: 'PENDING', label: 'Pending', count: uniqueTours.filter(t => t.status === 'PENDING').length },
        { id: 'COMPLETED', label: 'Completed', count: uniqueTours.filter(t => t.status === 'COMPLETED').length },
        { id: 'CANCELLED', label: 'Cancelled', count: uniqueTours.filter(t => t.status === 'CANCELLED').length }
    ];

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="pb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Guide Dashboard</h1>
                    <p className="text-gray-600">Welcome to your dashboard, {user?.name || 'Guide'}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={History}
                        title="Completed"
                        value={stats.completedToursCount}
                        subtitle="Tours done"
                        color="purple"
                    />
                    <StatCard
                        icon={MapPin}
                        title="Upcoming"
                        value={stats.upcomingToursCount}
                        subtitle="Scheduled"
                        color="blue"
                    />
                    <StatCard
                        icon={Check}
                        title="Total Earnings"
                        value={`$${(stats.totalEarnings || 0).toLocaleString()}`}
                        subtitle="Income from tours"
                        color="emerald"
                    />
                    <StatCard
                        icon={Star}
                        title="Average Rating"
                        value={stats.averageRating?.toFixed(1) || '0.0'}
                        subtitle="Out of 5"
                        color="yellow"
                    />
                </div>


                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'companies', label: 'Companies', icon: Building2 },
                            { id: 'bookings', label: 'Bookings', icon: ClipboardList },
                            { id: 'invitations', label: 'Invitations', icon: ClipboardList }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'companies' && (
                    <>
                        {companies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {companies.map(company => <GuideCompanyCard key={company.id} company={company} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                                <p className="text-gray-500">You're not affiliated with any companies yet. Wait for invitations or contact companies directly.</p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'bookings' && (
                    <>
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
                            handleCheckInSelect={setDateFilter}
                            searchData={{ checkIn: dateFilter }}
                            currentMonth={currentMonth}
                            setCurrentMonth={setCurrentMonth}
                        />

                        {filteredBookings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {filteredBookings.map(t => <GuideTourCard key={t.id} tour={t} onViewBookings={handleViewBookings} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ClipboardList className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        )}

                        <BookingModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            bookings={selectedBookings}
                        />
                    </>
                )}

                {activeTab === 'invitations' && (
                    <div className="space-y-4">
                        {invitations.length > 0 ? (
                            invitations.map(inv => (
                                <InvitationCard
                                    key={inv.id}
                                    invitation={inv}
                                    onAccept={() => handleAccept(inv.id)}
                                    onDecline={() => handleDecline(inv.id)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ClipboardList className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                                <p className="text-gray-500">You currently have no invitations.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideDashboardPage;
