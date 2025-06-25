import React, {useEffect, useRef, useState} from 'react';
import TourCard from "./TourCard.jsx";
import axios from "axios";
import SearchBar from "./SearchBar.jsx";



const UserDashboard = () => {
    const [tours, setTours] = useState([]);
    const [error, setError] = useState('');
    const [searchData, setSearchData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        visitors: 1
    });
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
    const [showVisitorSelector, setShowVisitorSelector] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);
    const guestRef = useRef(null);

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
            <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16 px-4">
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
                        showVisitorSelector={showVisitorSelector}
                        setShowCheckInCalendar={setShowCheckInCalendar}
                        setShowCheckOutCalendar={setShowCheckOutCalendar}
                        setShowVisitorSelector={setShowVisitorSelector}
                        checkInRef={checkInRef}
                        checkOutRef={checkOutRef}
                        guestRef={guestRef}
                        handleCheckInSelect={handleCheckInSelect}
                        handleCheckOutSelect={handleCheckOutSelect}
                        handleSearch={handleSearch}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />
                </div>
            </section>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular tours in Santa Cruz</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
        </main>
        </div>
    );
};

export default UserDashboard;