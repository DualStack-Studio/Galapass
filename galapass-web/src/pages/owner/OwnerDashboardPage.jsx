import React, { useState } from 'react';
import {Building2, Plus, MapPin, Users, DollarSign, Mail, RefreshCw, X } from 'lucide-react';
import CompanyCard from '../../components/OwnerView/Dashboard/CompanyCard.jsx';
import TourCard from '../../components/OwnerView/Dashboard/TourCard.jsx';
import GuideCard from '../../components/OwnerView/Dashboard/GuideCard.jsx';
import StatCard from '../../components/StatCard.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import { useOwnerDashboard } from '../../hooks/useOwnerDashboard.js';
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import {cancelInvitation, resendInvitation, useInvitations} from '../../hooks/useInvitations';
import { toast } from 'react-hot-toast';

const OwnerDashboardPage = () => {
    const { user } = useAuth();
    const ownerId = user?.id;

    const [activeTab, setActiveTab] = useState('companies');
    const navigate = useNavigate();
    const [activeSubTab, setActiveSubTab] = useState('guides-list');

    const getStatusBadge = (status) => {
        const base = "px-2 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case 'PENDING':
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
            case 'ACCEPTED':
                return <span className={`${base} bg-emerald-100 text-emerald-800`}>Accepted</span>;
            case 'DECLINED':
                return <span className={`${base} bg-red-100 text-red-800`}>Declined</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-500`}>Unknown</span>;
        }
    };

    async function handleCancel(id) {
        try {
            setInvitations(prev => prev.filter(inv => inv.id !== id));
            await cancelInvitation(id);
            toast.success('Invitation cancelled');
        } catch (e) {
            toast.error('Failed to cancel invitation');
            console.error(e);
        }
    }

    async function handleResend(id) {
        try {
            await resendInvitation(id);
            await refetchInvitations();
        } catch (e) {
            console.error(e);
        }
    }


    const {
        companies,
        tours,
        guides,
        stats,
        loading,
        error,
        refetch
    } = useOwnerDashboard(ownerId);

    const companyId = companies.length > 0 ? companies[0].id : null;

    const { invitations: fetchedInvitations, loading: invitationsLoading, error: invitationsError, refetch: refetchInvitations } =
        useInvitations(companyId);

    const [invitations, setInvitations] = useState([]);

    React.useEffect(() => {
        setInvitations(fetchedInvitations);
    }, [fetchedInvitations]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;
    }

    return (
        <div className="bg-white">
            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tour Operator Dashboard</h1>
                        <p className="text-gray-600">Manage your Galápagos tour business</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Building2} title="Companies" value={stats.companiesCount} subtitle="Active businesses" />
                    <StatCard icon={MapPin} title="Tours" value={stats.toursCount} subtitle="Total offerings" color="blue" />
                    <StatCard icon={Users} title="Guides" value={stats.guidesCount} subtitle="Team members" color="purple" />
                    <StatCard icon={DollarSign} title="Revenue" value={`$${stats.revenue}`} subtitle="This month" color="green" />
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'companies', label: 'Companies', icon: Building2 },
                            { id: 'tours', label: 'Tours', icon: MapPin },
                            { id: 'guides', label: 'Guides', icon: Users },
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

                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Your Companies</h2>
                            <button
                                onClick={() => navigate('/owner/add-company')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Company</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companies.map((company) => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tours Tab */}
                {activeTab === 'tours' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Your Tours</h2>
                            <button
                                onClick={() => navigate('/owner/add-tour')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Tour</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Guides Tab */}
                {activeTab === 'guides' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Your Guides</h2>
                            <button
                                onClick={() => navigate('/owner/add-guide')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Invite Guide</span>
                            </button>
                        </div>

                        {/* Sub-tabs for Guides */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                {[
                                    { id: 'guides-list', label: 'Guides' },
                                    { id: 'invitations', label: 'Invitations' }
                                ].map((subTab) => (
                                    <button
                                        key={subTab.id}
                                        onClick={() => setActiveSubTab(subTab.id)}
                                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                                            activeSubTab === subTab.id
                                                ? 'border-emerald-500 text-emerald-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <span>{subTab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {activeSubTab === 'guides-list' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {guides.map((guide) => (
                                    <GuideCard key={guide.id} guide={guide} />
                                ))}
                            </div>
                        )}

                        {activeSubTab === 'invitations' && (
                            <div className="space-y-4">
                                {invitations.filter(inv => inv.status !== 'ACCEPTED').length > 0 ? (
                                    invitations
                                        .filter(invite => invite.status !== 'ACCEPTED')
                                        .map((invite) => (
                                            <div key={invite.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <Mail className="w-5 h-5 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-medium text-gray-900">{invite.email}</h3>
                                                                <div className="flex items-center space-x-4 mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                invite.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : invite.status === 'declined'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                            </span>
                                                                    <span className="text-sm text-gray-500">
                                                Sent {new Date(invite.sentAt).toLocaleDateString()}
                                            </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        {invite.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleResend(invite.id)}
                                                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1"
                                                            >
                                                                <RefreshCw className="w-4 h-4" />
                                                                <span>Resend</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancel(invite.id)}
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1 cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {invite.message && (
                                                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                                        <p className="text-sm text-gray-600">{invite.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                                        <p className="text-gray-500 mb-6">Invite guides to help manage your company.</p>
                                        <button
                                            onClick={() => navigate('/owner/add-guide')}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Send Your First Invitation</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboardPage;