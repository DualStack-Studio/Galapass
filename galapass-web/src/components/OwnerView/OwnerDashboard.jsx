import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Users, DollarSign } from 'lucide-react';
import CompanyCard from './CompanyCard.jsx';
import TourCard from './TourCard.jsx';
import GuideCard from './GuideCard.jsx';
import StatCard from '../StatCard.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const ownerId = user?.id;

    const [activeTab, setActiveTab] = useState('companies');

    const [companies, setCompanies] = useState([]);
    const [tours, setTours] = useState([]);
    const [guides, setGuides] = useState([]);

    const [companiesCount, setCompaniesCount] = useState(0);
    const [toursCount, setToursCount] = useState(0);
    const [guidesCount, setGuidesCount] = useState(0);
    const [revenue, setRevenue] = useState(0);

    const fetchStats = async () => {
        const res = await fetch(`http://localhost:8080/api/ownerDashboard/stats/${ownerId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        const data = await res.json();

        setCompaniesCount(data.totalCompanies);
        setToursCount(data.totalTours);
        setGuidesCount(data.totalGuides);
        setRevenue(data.totalRevenue);
    };

    const fetchCompanies = async () => {
        const res = await fetch(`http://localhost:8080/api/companies/owner/${ownerId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch companies');
        }

        const data = await res.json();
        setCompanies(data);

        const extractedTours = data.flatMap((company) => company.tours);
        const extractedGuides = data.flatMap((company) => company.guides);

        setTours(extractedTours);
        setGuides(extractedGuides);
    };

    useEffect(() => {
        if (!ownerId) return;

        const fetchAll = async () => {
            try {
                await fetchStats();
                await fetchCompanies();
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchAll();
    }, [ownerId]);

    return (
        <div>
            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tour Operator Dashboard</h1>
                        <p className="text-gray-600">Manage your Galápagos tour business</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Building2} title="Companies" value={companiesCount} subtitle="Active businesses" />
                    <StatCard icon={MapPin} title="Tours" value={toursCount} subtitle="Total offerings" color="blue" />
                    <StatCard icon={Users} title="Guides" value={guidesCount} subtitle="Team members" color="purple" />
                    <StatCard icon={DollarSign} title="Revenue" value={`$${revenue}`} subtitle="This month" color="green" />
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
                                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
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
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
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
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Guide</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guides.map((guide) => (
                                <GuideCard key={guide.id} guide={guide} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
