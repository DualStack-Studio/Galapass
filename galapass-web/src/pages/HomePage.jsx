import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(''); // State to hold error messages

    useEffect(() => {
        const fetchTours = async () => {
            try {
                // 1. Retrieve the token from wherever you store it (e.g., localStorage)
                const token = localStorage.getItem('token'); // Use the key you set during login

                if (!token) {
                    setError("Authentication token not found. Please log in.");
                    console.error("No token found in localStorage.");
                    return; // Stop the request if no token is available
                }

                // 2. Create the headers object for the request
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // 3. Make the GET request, passing the config object with the headers
                const response = await axios.get('http://localhost:8080/api/tours', config);

                setTours(response.data);
                setError(''); // Clear any previous errors on success

            } catch (err) {
                console.error("Error fetching tours:", err);
                if (err.response) {
                    // Handle errors like 401 Unauthorized or 403 Forbidden
                    setError(`Error: ${err.response.status} ${err.response.statusText}. Please check credentials.`);
                } else if (err.request) {
                    // Handle network errors or CORS issues
                    setError("Network Error: Could not connect to the server. Check CORS and server status.");
                } else {
                    // Handle other unexpected errors
                    setError("An unexpected error occurred while fetching data.");
                }
            }
        };

        fetchTours();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="bg-emerald-50 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="/images/galapassLogo.png" alt="Galapass Logo" className="h-10 w-auto" />
                    <h1 className="text-xl font-bold text-emerald-700">Galapass</h1>
                </div>
                <nav className="space-x-6 text-emerald-700 font-medium">
                    <a href="#" className="hover:underline">Tours</a>
                    <a href="#" className="hover:underline">Experiences</a>
                    <a href="#" className="hover:underline">Become a guide</a>
                </nav>
            </header>

            {/* Search Bar (your existing code) */}
            <section className="bg-emerald-100 py-8 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
                    <input type="text" placeholder="Where to?" className="w-full md:w-1/3 px-4 py-2 rounded-md border border-emerald-300" />
                    <input type="date" className="w-full md:w-1/4 px-4 py-2 rounded-md border border-emerald-300" />
                    <input type="date" className="w-full md:w-1/4 px-4 py-2 rounded-md border border-emerald-300" />
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">Search</button>
                </div>
            </section>

            {/* Tour Listings */}
            <main className="max-w-6xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Today in Santa Cruz</h2>

                {/* Display Error Message if one exists */}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={tour.photoUrl} alt={tour.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-emerald-800">{tour.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{tour.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-emerald-600 font-bold text-lg">${tour.price}</span>
                                    <span className="text-gray-500 text-sm">{tour.category}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">By {tour.company.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;