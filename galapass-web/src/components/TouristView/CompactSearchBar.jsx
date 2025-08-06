import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FiltersModal from './FiltersModal.jsx';
import CompactCalendar from '../OwnerView/TourDates/CompactCalendar.jsx';

const CompactSearchBar = ({
                              searchData,
                              handleInputChange,
                              handleSearch,
                              setIsFilterModalOpen,
                              activeFilterCount,
                              filters,
                              onFilterToggle,
                              onClear
                          }) => {
    const { t } = useTranslation();
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const destinationRef = useRef(null);
    const dateRef = useRef(null);
    const guestsRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (destinationRef.current && !destinationRef.current.contains(event.target)) {
                setShowDestinationDropdown(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setShowDateDropdown(false);
            }
            if (guestsRef.current && !guestsRef.current.contains(event.target)) {
                setShowGuestsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return t('compact_search.any_date');
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatGuests = (guests) => {
        return guests === 1 ? t('compact_search.one_guest') : t('compact_search.guests_count', { count: guests });
    };

    const handleDateSelect = (dateString) => {
        handleInputChange('startDate', dateString);
        setShowDateDropdown(false);
    };

    const handleDateClear = () => {
        handleInputChange('startDate', '');
    };

    return (
        <>
            <div className="bg-white rounded-full shadow-sm border border-gray-200 flex items-center max-w-md mx-auto">
                {/* Destination */}
                <div className="relative flex-1" ref={destinationRef}>
                    <button
                        onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 rounded-l-full flex items-center space-x-2 cursor-pointer"
                    >
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-700 truncate">
                            {searchData.destination || t('compact_search.anywhere')}
                        </span>
                    </button>

                    {showDestinationDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                            <input
                                type="text"
                                placeholder={t('compact_search.search_destinations')}
                                value={searchData.destination || ''}
                                onChange={(e) => handleInputChange('destination', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Date */}
                <div className="relative flex-1 border-l border-gray-200" ref={dateRef}>
                    <button
                        onClick={() => setShowDateDropdown(!showDateDropdown)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                    >
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-700 truncate">
                            {formatDate(searchData.startDate)}
                        </span>
                    </button>

                    {showDateDropdown && (
                        <CompactCalendar
                            isVisible={showDateDropdown}
                            onSelectDate={handleDateSelect}
                            onClose={() => setShowDateDropdown(false)}
                            selectedDate={searchData.startDate}
                            position="center"
                            currentMonth={currentMonth}
                            setCurrentMonth={setCurrentMonth}
                            isClear={true}
                            onClear={handleDateClear}
                        />
                    )}
                </div>

                {/* Guests */}
                <div className="relative flex-1 border-l border-gray-200" ref={guestsRef}>
                    <button
                        onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                    >
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-700 truncate">
                            {formatGuests(searchData.tourists)}
                        </span>
                    </button>

                    {showGuestsDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{t('compact_search.guests')}</span>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleInputChange('tourists', Math.max(1, searchData.tourists - 1))}
                                        disabled={searchData.tourists <= 1}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-medium w-8 text-center">{searchData.tourists}</span>
                                    <button
                                        onClick={() => handleInputChange('tourists', searchData.tourists + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters and Search */}
                <div className="flex items-center space-x-2 px-2">
                    {/* Filters */}
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="p-2 hover:bg-gray-50 rounded-full relative cursor-pointer"
                    >
                        <SlidersHorizontal size={16} className="text-gray-600" />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-colors cursor-pointer"
                    >
                        <Search size={16} />
                    </button>
                </div>
            </div>

            {/* Filters Modal */}
            <FiltersModal
                isOpen={isFilterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onFilterToggle={onFilterToggle}
                onClear={onClear}
            />
        </>
    );
};

export default CompactSearchBar;
