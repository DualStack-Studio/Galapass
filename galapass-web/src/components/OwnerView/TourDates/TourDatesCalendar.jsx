import {ArrowLeft, Calendar} from "lucide-react";
import React, {useState} from "react";
import CompactCalendar from "./CompactCalendar";

const TourDatesCalendar = ({
                               tourDates,
                               setTourDates,
                               currentDate,
                               setCurrentDate,
                               setNewTourDate,
                               setEditingDate,
                               setIsCreating,
                               tour,
                               selectedDate,
                               setSelectedDate
                           }) => {
    const [animating, setAnimating] = useState(false);
    const [monthKey, setMonthKey] = useState(currentDate.getMonth() + '-' + currentDate.getFullYear());

    const isSameDate = (date1, date2) => {
        return date1.toDateString() === date2.toDateString();
    };

    const getTourDateForDay = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return tourDates.find(td => isSameDate(new Date(td.date), date));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);

        const existingTourDate = getTourDateForDay(day);

        if (existingTourDate) {
            setEditingDate(existingTourDate);
            setNewTourDate({
                date: clickedDate,
                price: existingTourDate.price.toString(),
                maxGuests: existingTourDate.maxGuests.toString(),
                available: existingTourDate.available
            });
        } else {
            setNewTourDate({
                date: clickedDate,
                price: tour.price.toString(),
                maxGuests: tour.maxGuests.toString(),
                available: true
            });
        }
        setIsCreating(true);
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
                setMonthKey(newDate.getMonth() + '-' + newDate.getFullYear());
                return newDate;
            });
            setAnimating(false);
        }, 200);
    };

    // Helper to check if a tour date has bookings
    const hasBookings = (tourDate) => tourDate && Array.isArray(tourDate.bookings) && tourDate.bookings.length > 0;

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-12"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const tourDate = getTourDateForDay(day);
            const isToday = isSameDate(date, new Date());
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isSelected = selectedDate && isSameDate(date, selectedDate);
            const isBooked = tourDate && Array.isArray(tourDate.bookings) && tourDate.bookings.length > 0;

            days.push(
                <div
                    key={day}
                    onClick={() => !isPast && handleDateClick(day)}
                    className={`
                        relative h-12 flex items-center justify-center cursor-pointer rounded-lg border-2 transition-all duration-200
                        ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-emerald-300'}
                        ${isToday ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}
                        ${isBooked ? 'bg-orange-200 text-orange-900 font-bold animate-pulse' : tourDate ? (tourDate.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800') : 'hover:bg-gray-50'}
                        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                    `}
                >
                    <span className="text-sm font-medium">{day}</span>
                    {tourDate && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-current opacity-60"></div>
                    )}
                </div>
            );
        }

        return days;
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>
            <div
                key={monthKey}
                className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
            >
                {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-emerald-100 rounded"></div>
                        <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-100 rounded"></div>
                        <span className="text-gray-600">Unavailable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-500 rounded"></div>
                        <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-200 rounded border border-orange-300"></div>
                        <span className="text-gray-600">Booked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDatesCalendar;