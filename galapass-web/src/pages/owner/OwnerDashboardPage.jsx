import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Users, DollarSign, Mail, RefreshCw, X, ArrowLeft, Download } from 'lucide-react';
import CompanyCard from '../../components/OwnerView/Dashboard/CompanyCard.jsx';
import TourCard from '../../components/OwnerView/Dashboard/TourCard.jsx';
import GuideCard from '../../components/OwnerView/Dashboard/GuideCard.jsx';
import StatCard from '../../components/StatCard.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from "react-router-dom";
import { useOwnerDashboard } from '../../hooks/useOwnerDashboard.js';
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { cancelInvitation, resendInvitation, useInvitations } from '../../hooks/useInvitations';
import { toast } from 'react-hot-toast';
import ConfirmModal from "../../components/OwnerView/ConfirmModal.jsx";
import ErrorModal from '../../components/ErrorModal.jsx';

const OwnerDashboardPage = () => {
    const { user } = useAuth();
    const ownerId = user?.id;

    const location = useLocation();
    const navigate = useNavigate();
    // Read tab from URL search param on load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
    }, [location.search]);

    const [activeTab, setActiveTab] = useState('companies');
    const [activeSubTab, setActiveSubTab] = useState('guides-list');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [guideToRemove, setGuideToRemove] = useState(null);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorRedirectPath, setErrorRedirectPath] = useState(''); // 1. Add state for the redirect path

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

    useEffect(() => {
        setInvitations(fetchedInvitations);
    }, [fetchedInvitations]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;
    }

    // 2. Modify the Add Tour handler
    const handleAddTourClick = () => {
        if (companies.length === 0) {
            setErrorMessage("You must create a company before adding a tour.");
            setErrorRedirectPath('/owner/add-company');
            setShowErrorModal(true);
        } else if (guides.length === 0) {
            setErrorMessage("You must invite at least one guide before adding a tour.");
            setErrorRedirectPath('/owner/add-guide');
            setShowErrorModal(true);
        } else {
            navigate('/owner/add-tour');
        }
    };

    const handleInviteGuideClick = () => {
        if (companies.length === 0) {
            setErrorMessage("You must create a company before inviting a guide.");
            setErrorRedirectPath('/owner/add-company');
            setShowErrorModal(true);
        } else {
            navigate('/owner/add-guide');
        }
    };

    const confirmRemoveGuide = (guideId) => {
        setGuideToRemove(guideId);
        setShowConfirmModal(true);
    };

    async function handleRemoveGuide() {
        try {
            const res = await fetch(`http://localhost:8080/api/companies/${companyId}/guides/${guideToRemove}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to remove guide');
            }

            toast.success('Guide removed');
            refetch();
        } catch (err) {
            toast.error("Failed to remove guide: " + err.message);
            console.error(err);
        } finally {
            setShowConfirmModal(false);
            setGuideToRemove(null);
        }
    }

    // When a tab is clicked, update the URL search param
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        const params = new URLSearchParams(location.search);
        params.set('tab', tabName);
        navigate({ search: params.toString() }, { replace: true });
    };

    return (
        <div className="bg-white">
            {/* Header and other components remain the same */}
            <div className="bg-white shadow-sm border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tour Operator Dashboard</h1>
                                <p className="text-gray-600">Manage your Galápagos tour business</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                onClick={() => handleTabClick(tab.id)}
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

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate('/owner/add-company')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Company</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companies.length > 0 ? (
                                companies.map((company) => (
                                    <CompanyCard key={company.id} company={company} />
                                ))
                            ) : (
                                <div className="text-center col-span-full py-16">
                                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-4">You haven’t created any companies yet.</p>
                                    <button
                                        onClick={() => navigate('/owner/add-company')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Your First Company</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tours Tab */}
                {activeTab === 'tours' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Your Tours</h2>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate('/owner/manage-bookings')}
                                    className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span>View All Bookings</span>
                                </button>
                                <button
                                    onClick={handleAddTourClick}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Tour</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.length > 0 ? (
                                tours.map((tour) => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))
                            ) : (
                                <div className="text-center col-span-full py-16">
                                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-4">You haven’t added any tours yet.</p>
                                    <button
                                        onClick={handleAddTourClick}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Your First Tour</span>
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* Guides Tab */}
                {activeTab === 'guides' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Your Guides</h2>
                            <button
                                onClick={handleInviteGuideClick}
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
                                {guides.length > 0 ? (
                                    [...new Map(guides.map(guide => [guide.name, guide])).values()].map((guide) => (
                                        <GuideCard key={guide.id} guide={guide} onRemove={confirmRemoveGuide} />
                                    ))
                                ) : (
                                    <div className="text-center col-span-full py-16">
                                        <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 mb-4">You don’t have any guides added to your company yet.</p>
                                        <button
                                            onClick={handleInviteGuideClick}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Invite Your First Guide</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSubTab === 'invitations' && (
                            // ... (invitations content remains the same)
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
                                                                <h3 className="text-lg font-medium text-gray-900">{invite.name}</h3>
                                                                <p className="text-sm text-gray-500">{invite.company}</p>
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
                                                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1 cursor-pointer"
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
                                            onClick={handleInviteGuideClick}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Send an Invitation First</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. Update the Modal's onClose handler */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => {
                    setShowErrorModal(false);
                    if (errorRedirectPath) {
                        navigate(errorRedirectPath);
                    }
                }}
                message={errorMessage}
            />
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleRemoveGuide}
                message="Are you sure you want to remove this guide from the company?"
            />
        </div>
    );
};

export default OwnerDashboardPage;

