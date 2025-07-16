import React from "react";
import { useTranslation } from 'react-i18next';

const UpcomingTourDates = ({ tourDates, setEditingDate, setNewTourDate, setIsCreating }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('tour_dates.upcoming_tour_dates')}</h3>
            <div className="space-y-3">
                {tourDates
                    // Filter for dates that are today or in the future
                    .filter(td => td.date >= new Date(new Date().setHours(0, 0, 0, 0)))
                    // Sort them with the soonest date first
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 5)
                    .map(tourDate => {
                        const peopleBookedOnThisDate = (tourDate.bookings ?? []).reduce(
                            (sum, booking) => sum + (booking.numberOfPeople || 0),
                            0
                        );
                        return (
                            <div
                                key={tourDate.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => {
                                    setEditingDate(tourDate);
                                    setNewTourDate({
                                        date: tourDate.date,
                                        price: tourDate.price.toString(),
                                        maxGuests: tourDate.maxGuests.toString(),
                                        available: tourDate.available,
                                        bookings: tourDate.bookings || [],
                                    });
                                    setIsCreating(true);
                                }}
                            >
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {(() => {
                                            const date = tourDate.date;
                                            const monthNames = t('calendar.monthNames', { returnObjects: true });
                                            const month = monthNames[date.getMonth()].slice(0, 3); // short month name
                                            return `${month} ${date.getDate()}`;
                                        })()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {t('tour_dates.booked', { booked: peopleBookedOnThisDate, max: tourDate.maxGuests })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">${tourDate.price}</div>
                                    <div className={`text-xs ${tourDate.available ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {tourDate.available ? t('tour_dates.available') : t('tour_dates.unavailable_short')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default UpcomingTourDates;
