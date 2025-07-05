// src/components/TouristView/CustomCalendar.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomCalendar = ({
                            isVisible,
                            onSelectDate,
                            onClose,
                            selectedDate,
                            position = 'left',
                            currentMonth,
                            setCurrentMonth
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
            const month_str = (month + 1).toString().padStart(2, '0');
            const day_str = day.toString().padStart(2, '0');
            const dateString = `${year}-${month_str}-${day_str}`;
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
        // This is the corrected line
        const selected = new Date(selectedDate.replace(/-/g, '/'));
        return selected.getDate() === day &&
            selected.getMonth() === month &&
            selected.getFullYear() === year;
    };

    return (
        <div
            className={`absolute top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 ${
                position === 'right'
                    ? 'right-0'
                    : position === 'center' || position === 'down'
                        ? 'left-1/2 -translate-x-1/2'
                        : 'left-0'
            }`}
            style={{ width: '320px' }}
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                    {monthNames[month]} {year}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        disabled={!day}
                        className={`
              h-10 w-10 rounded-full text-sm transition-all duration-200 cursor-pointer
              ${!day ? 'invisible' : ''}
              ${isToday(day) ? 'bg-gray-100 font-semibold' : ''}
              ${isSelected(day) ? 'bg-emerald-600 text-white font-semibold transform scale-105' : 'hover:bg-gray-100 text-gray-700'}
              ${day && !isSelected(day) ? 'hover:bg-emerald-50 hover:text-emerald-600' : ''}
            `}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
                >
                    Clear
                </button>
                <button
                    onClick={() => {
                        const today = new Date();
                        const todayString = today.toISOString().split('T')[0];
                        onSelectDate(todayString);
                        onClose();
                    }}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                    Today
                </button>
            </div>
        </div>
    );
};

export default CustomCalendar;