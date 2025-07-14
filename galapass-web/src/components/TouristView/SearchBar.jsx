import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Search, Users, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({
                       searchData,
                       handleInputChange,
                       handleSearch,
                       onFiltersChange,
                       setIsFilterModalOpen,
                       activeFilterCount
                   }) => {
    const { t, i18n } = useTranslation();

    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showTouristSelector, setShowTouristSelector] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startDateRef = useRef(null);
    const touristRef = useRef(null);
    const filtersRef = useRef(null);

    const formatDate = (dateString) => {
        if (!dateString) return t('select_start_date');
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language || undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleStartDateSelect = (date) => {
        handleInputChange('startDate', date);
        setShowStartDateCalendar(false);
    };

    const handleFilterChange = (filterType, value, isChecked) => {
        const currentValues = searchData[filterType] || [];
        const newValues = isChecked
            ? [...currentValues, value]
            : currentValues.filter((item) => item !== value);

        handleInputChange(filterType, newValues);
        if (onFiltersChange) onFiltersChange(filterType, newValues);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (startDateRef.current && !startDateRef.current.contains(event.target)) {
                setShowStartDateCalendar(false);
            }
            if (touristRef.current && !touristRef.current.contains(event.target)) {
                setShowTouristSelector(false);
            }
            if (filtersRef.current && !filtersRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-3 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-stretch gap-2">
                {/* Destination */}
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl min-w-0">
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                        {t('destination')}
                    </label>
                    <div className="flex items-center h-6">
                        <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder={t('search') + ' ' + t('destination').toLowerCase()}
                            value={searchData.destination || ''}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                            className="w-full text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                        />
                    </div>
                </div>

                {/* Start Date */}
                <div
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl relative min-w-0"
                    ref={startDateRef}
                >
                    <label className="block text-xs font-semibold text-gray-900 mb-1">{t('start_date')}</label>
                    <div className="flex items-center h-6">
                        <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <button
                            onClick={() => setShowStartDateCalendar(!showStartDateCalendar)}
                            className="w-full text-left text-sm text-gray-700 border-none outline-none bg-transparent cursor-pointer"
                        >
                            {formatDate(searchData.startDate)}
                        </button>
                    </div>
                    {showStartDateCalendar && (
                        <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                            <SimpleDatePicker
                                selectedDate={searchData.startDate}
                                onSelectDate={handleStartDateSelect}
                                currentMonth={currentMonth}
                                setCurrentMonth={setCurrentMonth}
                            />
                        </div>
                    )}
                </div>

                {/* Tourists */}
                <div
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl relative min-w-0"
                    ref={touristRef}
                >
                    <label className="block text-xs font-semibold text-gray-900 mb-1">{t('tourists')}</label>
                    <div className="flex items-center h-6">
                        <Users size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <button
                            onClick={() => setShowTouristSelector(!showTouristSelector)}
                            className="w-full text-left text-sm text-gray-700 border-none outline-none bg-transparent cursor-pointer"
                        >
                            {searchData.tourists === 1
                                ? `1 ${t('tourist')}`
                                : `${searchData.tourists || 1} ${t('tourists')}`}
                        </button>
                    </div>
                    {showTouristSelector && (
                        <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48">
                            <TouristSelector
                                tourists={searchData.tourists || 1}
                                onTouristChange={(tourists) => handleInputChange('tourists', tourists)}
                            />
                        </div>
                    )}
                </div>

                {/* Filters and Search Group */}
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    {/* Filters */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="p-3 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors relative cursor-pointer flex items-center justify-center"
                        aria-label={t('filters')}
                        ref={filtersRef}
                    >
                        <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {activeFilterCount}
              </span>
                        )}
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl transition-colors flex items-center justify-center w-full sm:w-auto"
                    >
                        <Search size={20} className="mr-2" />
                        <span className="hidden sm:inline">{t('search')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple Date Picker Component with translated month names and weekdays
const SimpleDatePicker = ({ selectedDate, onSelectDate, currentMonth, setCurrentMonth }) => {
    const { t, i18n } = useTranslation();
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Localized month names:
    const monthNames = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).formatToParts
        ? Array.from({ length: 12 }, (_, i) =>
            new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(new Date(year, i, 1))
        )
        : [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

    // Weekday short names localized:
    const weekdayNames = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(1970, 0, 4 + i); // Sunday = 0
        weekdayNames.push(
            day.toLocaleDateString(i18n.language, { weekday: 'short' }).substring(0, 2)
        );
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    const handleDateClick = (day) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onSelectDate(dateString);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    return (
        <div className="w-64">
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <ChevronDown size={16} className="rotate-90" />
                </button>
                <h3 className="font-semibold text-gray-900">
                    {monthNames[month]} {year}
                </h3>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <ChevronDown size={16} className="-rotate-90" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {weekdayNames.map((day) => (
                    <div key={day} className="p-2 text-gray-500 font-medium">
                        {day}
                    </div>
                ))}

                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={index} className="p-2"></div>;
                    }

                    const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();
                    const isSelected =
                        selectedDate ===
                        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isPast = new Date(year, month, day) < today;

                    return (
                        <button
                            key={day}
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            className={`p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                                isPast
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-emerald-600 text-white'
                                        : isToday
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'hover:bg-gray-100'
                            }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Tourist Selector Component with translation
const TouristSelector = ({ tourists, onTouristChange }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{t('number_of_tourists')}</span>
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onTouristChange(Math.max(1, tourists - 1))}
                    disabled={tourists <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    aria-label={t('decrease')}
                >
                    -
                </button>
                <span className="text-lg font-semibold text-gray-900">{tourists}</span>
                <button
                    onClick={() => onTouristChange(tourists + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    aria-label={t('increase')}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
