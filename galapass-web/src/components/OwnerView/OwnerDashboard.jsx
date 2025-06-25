import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Users, Calendar, DollarSign, Star, Settings, Eye } from 'lucide-react';
import CompanyCard from "./CompanyCard.jsx";
import TourCard from "./TourCard.jsx";
import GuideCard from "./GuideCard.jsx";
import StatCard from "../StatCard.jsx";

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('companies');
    const [companies, setCompanies] = useState([]);
    const [tours, setTours] = useState([]);
    const [guides, setGuides] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Simulate API calls
        setCompanies([
            { id: 1, name: 'Galápagos Adventures', location: 'Santa Cruz', toursCount: 12, guidesCount: 8, status: 'active' },
            { id: 2, name: 'Darwin Expeditions', location: 'San Cristóbal', toursCount: 8, guidesCount: 5, status: 'active' }
        ]);

        setTours([
            { id: 1, title: 'Marine Iguana Photography', price: 120, bookings: 24, rating: 4.8, status: 'active', companyId: 1 },
            { id: 2, title: 'Giant Tortoise Sanctuary', price: 85, bookings: 18, rating: 4.9, status: 'active', companyId: 1 },
            { id: 3, title: 'Snorkeling Adventure', price: 95, bookings: 31, rating: 4.7, status: 'active', companyId: 2 }
        ]);

        setGuides([
            { id: 1, name: 'Carlos Mendoza', email: 'carlos@galapagos.com', tours: 8, rating: 4.9, companyId: 1 },
            { id: 2, name: 'Maria Santos', email: 'maria@galapagos.com', tours: 6, rating: 4.8, companyId: 1 },
            { id: 3, name: 'Diego Reyes', email: 'diego@darwin.com', tours: 5, rating: 4.6, companyId: 2 }
        ]);
    }, []);

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
                    <StatCard icon={Building2} title="Companies" value="2" subtitle="Active businesses" />
                    <StatCard icon={MapPin} title="Tours" value="20" subtitle="Total offerings" color="blue" />
                    <StatCard icon={Users} title="Guides" value="13" subtitle="Team members" color="purple" />
                    <StatCard icon={DollarSign} title="Revenue" value="$12,450" subtitle="This month" color="green" />
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'companies', label: 'Companies', icon: Building2 },
                            { id: 'tours', label: 'Tours', icon: MapPin },
                            { id: 'guides', label: 'Guides', icon: Users }
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

                {/* Content based on active tab */}
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
                            {companies.map(company => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>
                    </div>
                )}

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
                            {tours.map(tour => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                )}

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
                            {guides.map(guide => (
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