import React, { useState, useEffect } from 'react';
import { MapPin, Target } from 'lucide-react';
import {BASE_URL} from "../../../config.js";


const StepBasicInfo = ({
                           formData,
                           setFormData,
                           handleInputChange,
                           categories,
                           locations,
                           destinations: initialDestinations, // Receive initial destinations as a prop
                           isEdit = false
                       }) => {

    // State to hold the dynamically fetched destinations
    const [destinations, setDestinations] = useState(initialDestinations || []);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);

    // This effect runs whenever the selected location changes
    useEffect(() => {
        const fetchDestinations = async () => {
            if (!formData.location) {
                setDestinations([]);
                setFormData(prev => ({ ...prev, destination: '' }));
                return;
            }

            setIsLoadingDestinations(true);
            try {
                const response = await fetch(`${BASE_URL}/api/enums/destinations/${formData.location}`, {
                    credentials: "include"
                });

                // Better error handling to see what the server is actually sending
                if (!response.ok) {
                    const errorText = await response.text(); // Get the response body as text
                    console.error(`Failed to fetch destinations. Status: ${response.status}. Response:`, errorText);
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                setDestinations(data);
            } catch (error) {
                console.error("Destination fetch error:", error);
                setDestinations([]);
                console.log(formData.location)
            } finally {
                setIsLoadingDestinations(false);
            }
        };

        fetchDestinations();
    }, [formData.location, setFormData]);

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What kind of tour will you host?</h2>
                <p className="text-lg text-gray-600">Choose the category that best describes your experience</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(category => (
                    <button
                        key={category.id}
                        type="button"
                        // Add the title attribute here to create the hover tooltip
                        title={category.name}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={`p-6 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer text-center ${
                            formData.category === category.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-3xl mb-3">{category.icon}</div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                    </button>
                ))}
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        What's the name of your tour?
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="E.g., Swimming with Sea Lions Adventure"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        Where is your tour's main departure point?
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                        >
                            <option value="">Select a location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {formData.location && (
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            Which specific destination will you visit?
                        </label>
                        <div className="relative">
                            <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                disabled={isLoadingDestinations || destinations.length === 0}
                                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {isLoadingDestinations ? (
                                    <option>Loading destinations...</option>
                                ) : destinations.length > 0 ? (
                                    <>
                                        <option value="">Select a destination</option>
                                        {/* CORRECTED: Use `key` and `displayName` from your API response */}
                                        {destinations.map(dest => (
                                            <option key={dest.key} value={dest.key}>
                                                {dest.displayName}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option>No destinations for this location</option>
                                )}
                            </select>
                        </div>
                    </div>
                )}
                {isEdit && (
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">Tour Status</label>
                        <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="">Select status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepBasicInfo;
