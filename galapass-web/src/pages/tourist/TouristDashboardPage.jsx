import React, {useEffect, useRef, useState} from 'react';
import TourCard from "../../components/TouristView/TourCard.jsx";
import axios from "axios";
import SearchBar from "../../components/TouristView/SearchBar.jsx";
import {useNavigate} from "react-router-dom";
import FiltersModal from "../../components/TouristView/FiltersModal.jsx";
import useTourEnums from "../../hooks/useTourEnums.js";



const TouristDashboardPage = () => {
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);
    const [error, setError] = useState('');
    const [searchData, setSearchData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        tourists: 1
    });
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
    const [showTouristSelector, setShowTouristSelector] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);
    const guestRef = useRef(null);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        searchTerm: '',
        categories: [],
        tags: [],
        durations: [],
        date: null,
        guests: 1,
    });

    const handleFilterToggle = (filterType, value) => {
        setFilters(prev => {
            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Add dates';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleInputChange = (field, value) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckInSelect = (date) => {
        handleInputChange('checkIn', date);
        setCurrentMonth(new Date(date));
    };

    const handleCheckOutSelect = (date) => {
        handleInputChange('checkOut', date);
    };

    const handleSearch = () => {
        console.log('Searching with:', searchData);
    };

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/tours');
                setTours(res.data);
            } catch (err) {
                setError('Failed to fetch tours.');
            }
        };
        fetchTours();
    }, []);
    return (
        <div>
            <section className="bg-gradient-to-b from-emerald-100 to-white py-16 px-4">
            <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Discover the <span className="text-emerald-600">Galápagos</span>
                        </h2>
                        <p className="text-xl text-gray-600">Find unique tours in nature's laboratory</p>
                    </div>
                    <SearchBar
                        searchData={searchData}
                        handleInputChange={handleInputChange}
                        formatDate={formatDate}
                        showCheckInCalendar={showCheckInCalendar}
                        showCheckOutCalendar={showCheckOutCalendar}
                        showTouristSelector={showTouristSelector}
                        setShowCheckInCalendar={setShowCheckInCalendar}
                        setShowCheckOutCalendar={setShowCheckOutCalendar}
                        setShowTouristSelector={setShowTouristSelector}
                        checkInRef={checkInRef}
                        checkOutRef={checkOutRef}
                        guestRef={guestRef}
                        handleCheckInSelect={handleCheckInSelect}
                        handleCheckOutSelect={handleCheckOutSelect}
                        handleSearch={handleSearch}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        setIsFilterModalOpen={setIsFilterModalOpen}
                    />
                </div>
            </section>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular tours in Santa Cruz</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map(tour => (
                        <TourCard
                            key={tour.id}
                            tour={tour}
                            onClick={() => navigate(`/tourist/tour/${tour.id}`)}
                        />
                    ))}
                </div>
            </main>

            <FiltersModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFilterToggle={handleFilterToggle}
                onClear={() => {
                    setFilters(prev => ({...prev, categories: [], tags: [], durations: []}));
                }}
            />
        </div>
    );
};

export default TouristDashboardPage;