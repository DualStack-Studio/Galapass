import React from 'react';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import CustomCalendar from '../CustomCalendar.jsx';
import TouristSelector from './TouristSelector.jsx';

const SearchBar = ({
                       searchData,
                       handleInputChange,
                       formatDate,
                       showCheckInCalendar,
                       showCheckOutCalendar,
                       showTouristSelector,
                       setShowCheckInCalendar,
                       setShowCheckOutCalendar,
                       setShowTouristSelector,
                       checkInRef,
                       checkOutRef,
                       guestRef,
                       handleCheckInSelect,
                       handleCheckOutSelect,
                       handleSearch,
                       currentMonth,
                       setCurrentMonth
                   }) => {
    return (
        <div className="bg-white rounded-full shadow-lg p-2 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-stretch">
                {/* Where */}
                <div className="flex-1 px-6 py-4 border-r-0 md:border-r border-gray-200 border-b md:border-b-0">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">Where</label>
                    <div className="flex items-center h-6">
                        <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search destinations"
                            value={searchData.destination}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                            className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                        />
                    </div>
                </div>

                {/* Check in */}
                <div className="flex-1 px-6 py-4 border-r-0 md:border-r border-gray-200 border-b md:border-b-0 relative" ref={checkInRef}>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">Check in</label>
                    <div className="flex items-center h-6">
                        <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <button
                            onClick={() => {
                                setShowCheckInCalendar(!showCheckInCalendar);
                                setShowCheckOutCalendar(false);
                            }}
                            className="w-full text-left text-sm text-gray-700 border-none outline-none bg-transparent"
                        >
                            {formatDate(searchData.checkIn)}
                        </button>
                    </div>
                    <CustomCalendar
                        isVisible={showCheckInCalendar}
                        onSelectDate={handleCheckInSelect}
                        onClose={() => setShowCheckInCalendar(false)}
                        selectedDate={searchData.checkIn}
                        position="left"
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />
                </div>

                {/* Check out */}
                <div className="flex-1 px-6 py-4 border-r-0 md:border-r border-gray-200 border-b md:border-b-0 relative" ref={checkOutRef}>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">Check out</label>
                    <div className="flex items-center h-6">
                        <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <button
                            onClick={() => {
                                setShowCheckOutCalendar(!showCheckOutCalendar);
                                setShowCheckInCalendar(false);
                            }}
                            className="w-full text-left text-sm text-gray-700 border-none outline-none bg-transparent"
                        >
                            {formatDate(searchData.checkOut)}
                        </button>
                    </div>
                    <CustomCalendar
                        isVisible={showCheckOutCalendar}
                        onSelectDate={handleCheckOutSelect}
                        onClose={() => setShowCheckOutCalendar(false)}
                        selectedDate={searchData.checkOut}
                        position="right"
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />
                </div>

                {/* Tourists */}
                <div className="flex-1 px-6 py-4 min-w-0 relative" ref={guestRef}>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">Who</label>
                    <div className="flex items-center justify-between h-6">
                        <div className="flex items-center min-w-0 flex-1">
                            <Users size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                            <button
                                onClick={() => {
                                    setShowTouristSelector(!showTouristSelector);
                                    setShowCheckInCalendar(false);
                                    setShowCheckOutCalendar(false);
                                }}
                                className="text-left text-sm text-gray-700 border-none outline-none bg-transparent min-w-0 flex-1"
                            >
                                {searchData.tourists === 1 ? '1 tourist' : `${searchData.tourists} tourists`}
                            </button>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full transition-colors ml-3 flex-shrink-0"
                        >
                            <Search size={16} />
                        </button>
                    </div>
                    <TouristSelector
                        isVisible={showTouristSelector}
                        onClose={() => setShowTouristSelector(false)}
                        tourists={searchData.tourists}
                        onTouristChange={(tourists) => handleInputChange('tourists', tourists)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
