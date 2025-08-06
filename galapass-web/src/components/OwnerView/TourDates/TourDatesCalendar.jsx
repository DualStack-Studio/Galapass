// src/components/OwnerView/TourDates/TourDatesCalendar.jsx
import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const TourDatesCalendar = ({
                               tourDates,
                               currentDate,
                               setCurrentDate,
                               onDateClick,
                               selectedDate
                           }) => {
    const { t } = useTranslation();
    const [animating, setAnimating] = useState(false);

    const isSameDate = (date1, date2) => {
        return date1.toDateString() === date2.toDateString();
    };

    const getTourDatesForDay = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return tourDates.filter(td => isSameDate(new Date(td.date), date));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onDateClick(clickedDate);
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrentDate(prev => {
                const newDate = new Date(prev);
                newDate.setMonth(prev.getMonth() + direction);
                return newDate;
            });
            setAnimating(false);
        }, 150);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-18"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayTourDates = getTourDatesForDay(day);
            const isToday = isSameDate(date, new Date());
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isSelected = selectedDate && isSameDate(date, selectedDate);
            const hasBookings = dayTourDates.some(td => td.bookings && td.bookings.length > 0);

            days.push(
                <div
                    key={day}
                    onClick={() => !isPast && handleDateClick(day)}
                    className={`
                        relative h-18 p-2 cursor-pointer rounded-lg border-2 transition-all duration-200
                        ${isPast ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-emerald-300 hover:shadow-md'}
                        ${isToday ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}
                        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 bg-emerald-100' : ''}
                        ${dayTourDates.length > 0 ? 'bg-white shadow-sm' : 'hover:bg-gray-50'}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-xs font-semibold ${isToday ? 'text-emerald-800' : 'text-gray-900'}`}>
                            {day}
                        </span>
                        {dayTourDates.length > 0 && (
                            <span className="text-xs bg-emerald-600 text-white px-1 py-0.5 rounded-full">
                                {dayTourDates.length}
                            </span>
                        )}
                    </div>

                    {/* Tour date indicators */}
                    <div className="mt-0.5 space-y-0.5">
                        {dayTourDates.slice(0, 1).map((td) => {
                            const totalBookings = (td.bookings || []).reduce((sum, booking) =>
                                sum + (booking.numberOfPeople || 0), 0);
                            const isFullyBooked = totalBookings >= td.maxGuests;

                            return (
                                <div
                                    key={td.id}
                                    className={`text-xs px-1 py-0.5 rounded text-center truncate ${
                                        isFullyBooked
                                            ? 'bg-red-100 text-red-800'
                                            : hasBookings
                                                ? 'bg-orange-100 text-orange-800'
                                                : td.available
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {new Date(td.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                </div>
                            );
                        })}
                        {dayTourDates.length > 1 && (
                            <div className="text-xs text-gray-500 text-center">
                                +{dayTourDates.length - 1} {t('booking_management.more')}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const monthNames = t('calendar.monthNames', { returnObjects: true, defaultValue: [] });
    const dayNames = t('calendar.abreviatedDayNames', { returnObjects: true, defaultValue: [] });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                    <span>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                </h2>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            <div className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-100 rounded border border-emerald-200"></div>
                        <span className="text-gray-700">{t('tour_dates.available')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-100 rounded border border-orange-200"></div>
                        <span className="text-gray-700">{t('tour_dates.has_bookings')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-100 rounded border border-red-200"></div>
                        <span className="text-gray-700">{t('tour_dates.fully_booked')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-50 border-2 border-emerald-500 rounded"></div>
                        <span className="text-gray-700">{t('tour_dates.today')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDatesCalendar;