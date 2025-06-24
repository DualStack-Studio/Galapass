import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

const AddTourModal = ({ isOpen, onClose, onTourAdded }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        photoUrl: '',
        guideIds: [], // For simplicity, we'll handle this as a comma-separated string
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.companyId) {
            setError("Cannot create tour: User or Company ID is missing.");
            return;
        }

        setIsLoading(true);
        setError('');

        // Prepare payload matching CreateTourRequest DTO
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            guideIds: formData.guideIds.length > 0 ? formData.guideIds.split(',').map(id => parseInt(id.trim())) : [],
            ownerId: user.id,
            companyId: user.companyId,
        };

        try {
            await axios.post('http://localhost:8080/api/tours', payload);
            onTourAdded(); // Callback to refresh the dashboard
            onClose(); // Close the modal
        } catch (err) {
            console.error("Failed to create tour:", err);
            setError(err.response?.data?.message || "An error occurred while creating the tour.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">Add a New Tour</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* All form fields go here */}
                    <div className="md:col-span-2">
                        <label>Title</label>
                        <input name="title" onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label>Description</label>
                        <textarea name="description" onChange={handleChange} required rows="3" className="mt-1 w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                    <div>
                        <label>Price ($)</label>
                        <input name="price" type="number" step="0.01" onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label>Category</label>
                        <input name="category" onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label>Location</label>
                        <input name="location" onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label>Photo URL</label>
                        <input name="photoUrl" onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label>Guide IDs (comma-separated)</label>
                        <input name="guideIds" onChange={handleChange} placeholder="e.g., 1, 2, 3" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>

                    <div className="md:col-span-2 text-right">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                            {isLoading ? 'Saving...' : 'Save Tour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTourModal;