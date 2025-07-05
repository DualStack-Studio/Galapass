import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Clock, History, ClipboardList, Check, X } from 'lucide-react';
import { useGuideDashboard } from '../../hooks/useGuideDashboard.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import GuideCompanyCard from '../../components/GuideView/Dashboard/GuideCompanyCard.jsx';
import GuideTourCard from '../../components/GuideView/Dashboard/GuideTourCard.jsx';
import InvitationCard from '../../components/GuideView/Invitation/InvitationCard.jsx';
import BookingModal from '../../components/GuideView/Booking/BookingModal.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { toast } from 'react-hot-toast';

const GuideDashboardPage = () => {
    const { user } = useAuth();
    const guideId = user?.id;
    const [activeTab, setActiveTab] = useState('companies');
    const [bookingStatusFilter, setBookingStatusFilter] = useState('CONFIRMED');
    const [selectedTour, setSelectedTour] = useState(null);
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

    const handleViewBookings = async (tour) => {
        try {
            const res = await fetch(`http://localhost:8080/api/bookings?tourId=${tour.id}&guideId=${guideId}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setSelectedTour(tour);
            setSelectedBookings(data);
            setModalOpen(true);
        } catch (err) {
            toast.error("Failed to load bookings");
        }
    };

    const handleAccept = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/invitations/${id}/accept`, {
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
            const res = await fetch(`http://localhost:8080/api/invitations/${id}/decline`, {
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
                    <StatCard icon={Building2} title="Companies" value={stats.companiesCount} subtitle="Affiliated" />
                    <StatCard icon={MapPin} title="Upcoming Tours" value={stats.upcomingToursCount} subtitle="Scheduled" color="blue" />
                    <StatCard icon={Clock} title="Active Tours" value={stats.activeToursCount} subtitle="Ongoing" color="purple" />
                    <StatCard icon={History} title="Completed" value={stats.completedToursCount} subtitle="Tours done" color="green" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map(company => <GuideCompanyCard key={company.id} company={company} />)}
                    </div>
                )}

                // Enhanced booking status filter section
                {activeTab === 'bookings' && (
                    <>
                        <div className="mb-6 flex flex-wrap gap-3">
                            {[
                                {
                                    status: 'CONFIRMED',
                                    label: 'Confirmed',
                                    icon: Check,
                                    color: 'emerald',
                                    bgColor: 'bg-emerald-50',
                                    textColor: 'text-emerald-700',
                                    borderColor: 'border-emerald-200',
                                    activeBg: 'bg-emerald-600',
                                    hoverBg: 'hover:bg-emerald-100'
                                },
                                {
                                    status: 'PENDING',
                                    label: 'Pending',
                                    icon: Clock,
                                    color: 'amber',
                                    bgColor: 'bg-amber-50',
                                    textColor: 'text-amber-700',
                                    borderColor: 'border-amber-200',
                                    activeBg: 'bg-amber-600',
                                    hoverBg: 'hover:bg-amber-100'
                                },
                                {
                                    status: 'COMPLETED',
                                    label: 'Completed',
                                    icon: History,
                                    color: 'green',
                                    bgColor: 'bg-green-50',
                                    textColor: 'text-green-700',
                                    borderColor: 'border-green-200',
                                    activeBg: 'bg-green-600',
                                    hoverBg: 'hover:bg-green-100'
                                }
                            ].map(({ status, label, icon: Icon, bgColor, textColor, borderColor, activeBg, hoverBg }) => (
                                <button
                                    key={status}
                                    onClick={() => setBookingStatusFilter(status)}
                                    className={`
                        relative flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm 
                        border transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                        ${bookingStatusFilter === status
                                        ? `${activeBg} text-white border-transparent shadow-md`
                                        : `${bgColor} ${textColor} ${borderColor} ${hoverBg} hover:shadow-sm`
                                    }
                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                    {bookingStatusFilter === status && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...activeTours, ...upcomingTours, ...completedTours, ...tourHistory]
                                .filter((tour, idx, self) => self.findIndex(t => t.id === tour.id) === idx)
                                .filter(t => t.status === bookingStatusFilter)
                                .map(t => <GuideTourCard key={t.id} tour={t} onViewBookings={handleViewBookings} />)}
                        </div>

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