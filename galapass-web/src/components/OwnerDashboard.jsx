import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import AddTourModal from '../components/AddTourModal'; // We will create this next

const OwnerDashboard = () => {
    const [company, setCompany] = useState(null);
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { user } = useAuth();

    const fetchDashboardData = async () => {
        if (!user || !user.companyId) {
            setError('User is not a tour operator or company ID is missing.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const companyPromise = axios.get(`http://localhost:8080/api/companies/${user.companyId}`);
            // Use the new endpoint we just created
            const toursPromise = axios.get(`http://localhost:8080/api/companies/${user.companyId}/tours`);

            const [companyRes, toursRes] = await Promise.all([companyPromise, toursPromise]);

            setCompany(companyRes.data);
            setTours(toursRes.data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError('Could not load your dashboard. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
    if (!company) return <div className="text-center text-gray-500 p-8">No company data found.</div>

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">{company.name}</h1>
                    <p className="text-md text-gray-600 mt-1">{company.description}</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Our Tours</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <PlusCircle size={20} />
                        Add New Tour
                    </button>
                </div>

                {/* Tours Table */}
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {tours.length > 0 ? tours.map(tour => (
                            <tr key={tour.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tour.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tour.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18}/></button>
                                    <button className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">You haven't added any tours yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>

            <AddTourModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onTourAdded={fetchDashboardData} // Refresh data after adding a tour
            />
        </div>
    );
};

export default OwnerDashboard;