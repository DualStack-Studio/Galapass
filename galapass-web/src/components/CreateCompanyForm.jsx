import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // We need this to get the ownerId and refresh the user

const CreateCompanyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, refreshUser } = useAuth(); // Assuming refreshUser exists in your context

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to create a company.");
            return;
        }

        setIsLoading(true);
        setError('');

        const payload = {
            ...formData,
            ownerId: user.id, // Pass the current user's ID as the owner
        };

        try {
            await axios.post('http://localhost:8080/api/companies', payload);
            // CRUCIAL STEP: Refresh the user data from the context.
            // This will update the user object with the new companyId,
            // causing the OwnerDashboard to re-render and show the tours view.
            await refreshUser();
        } catch (err) {
            console.error("Failed to create company:", err);
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-50">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Create Your Company</h1>
                    <p className="mt-2 text-gray-600">Let's get your tour company set up on Galapass.</p>
                </div>

                {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input id="name" name="name" type="text" onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-3" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" name="description" onChange={handleChange} required rows="4" className="mt-1 w-full border border-gray-300 rounded-md p-3"></textarea>
                    </div>
                    <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL (Optional)</label>
                        <input id="logoUrl" name="logoUrl" type="url" onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-3" />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                            {isLoading ? 'Creating...' : 'Create Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompanyForm;