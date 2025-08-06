import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Calendar = ({ availableDates = [], selectedDate, onDateSelect }) => {
    const { t } = useTranslation();

    const getInitialDate = () => {
        if (availableDates.length > 0 && availableDates[0].date) {
            try {
                const firstDate = new Date(availableDates[0].date);
                if (!isNaN(firstDate.getTime())) {
                    return new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
                }
            } catch (e) {
                console.error("Invalid date format in availableDates:", availableDates[0].date);
            }
        }
        return new Date();
    };

    const [currentDate, setCurrentDate] = useState(getInitialDate());

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const availableDatesSet = useMemo(() => {
        const dates = availableDates
            .filter(d => d.available)
            .map(d => d.date.split('T')[0]);
        return new Set(dates);
    }, [availableDates]);

    const changeMonth = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDateClick = (dateString) => {
        const originalDateObject = availableDates.find(d => d.date.startsWith(dateString));
        if (originalDateObject) {
            onDateSelect(originalDateObject.date);
        }
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get translated arrays with fallbacks
    const monthNames = t('calendar.monthNames', { returnObjects: true }) || [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = t('calendar.dayNames', { returnObjects: true }) || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const days = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isAvailable = availableDatesSet.has(dateString);
        const isSelected = selectedDate && dateString === selectedDate.split('T')[0];
        const isPast = dayDate < today;
        const isDisabled = isPast || !isAvailable;

        let buttonClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 text-sm ";
        if (isDisabled) {
            buttonClasses += "text-gray-300 cursor-not-allowed line-through";
        } else if (isSelected) {
            buttonClasses += "bg-teal-600 text-white font-bold ring-2 ring-teal-300";
        } else {
            buttonClasses += "bg-teal-50 text-teal-800 hover:bg-teal-200 font-medium cursor-pointer";
        }

        days.push(
            <button
                key={dateString}
                disabled={isDisabled}
                onClick={() => handleDateClick(dateString)}
                className={buttonClasses}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-lg text-gray-800">
                    {monthNames[month]} {year}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-500 mb-2">
                {dayNames.map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {days}
            </div>
        </div>
    );
};

export default Calendar;
