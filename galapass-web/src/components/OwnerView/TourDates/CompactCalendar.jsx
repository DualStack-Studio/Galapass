import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CompactCalendar = ({
                             isVisible,
                             onSelectDate,
                             onClose,
                             selectedDate,
                             position = 'left',
                             currentMonth,
                             setCurrentMonth,
                             renderDay // new prop for custom day rendering
                         }) => {
    if (!isVisible) return null;

    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    const handleDateClick = (day) => {
        if (day) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            onSelectDate(dateString);
            onClose();
        }
    };

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    };

    const isToday = (day) => {
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    const isSelected = (day) => {
        if (!selectedDate || !day) return false;
        const selected = new Date(selectedDate.replace(/-/g, '/'));
        return selected.getDate() === day &&
            selected.getMonth() === month &&
            selected.getFullYear() === year;
    };

    return (
        <div
            className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-fade-in ${
                position === 'right'
                    ? 'right-0'
                    : position === 'center' || position === 'down'
                        ? 'left-1/2 -translate-x-1/2'
                        : 'left-0'
            }`}
            style={{ width: '280px' }}
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <h3 className="text-base font-semibold text-gray-800">
                    {monthNames[month]} {year}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ChevronRight size={18} className="text-gray-600" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    let custom = renderDay ? renderDay(day) : null;
                    let customClass = '';
                    if (custom === 'booked') {
                        customClass = 'bg-orange-200 text-orange-900 font-bold animate-pulse';
                    }
                    return (
                        <button
                            key={index}
                            onClick={() => handleDateClick(day)}
                            disabled={!day}
                            className={`
                                h-8 w-8 rounded-full text-xs transition-all duration-200 cursor-pointer
                                ${!day ? 'invisible' : ''}
                                ${isToday(day) ? 'bg-gray-100 font-semibold' : ''}
                                ${isSelected(day) ? 'bg-emerald-600 text-white font-semibold transform scale-105' : 'hover:bg-gray-100 text-gray-700'}
                                ${day && !isSelected(day) ? 'hover:bg-emerald-50 hover:text-emerald-600' : ''}
                                ${customClass}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CompactCalendar;
