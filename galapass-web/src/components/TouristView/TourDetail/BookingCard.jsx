import {useNavigate} from "react-router-dom";
import {CalendarIcon, Minus, Plus, User} from "lucide-react";
import { useTranslation } from 'react-i18next';

const BookingCard = ({tour, upcomingDates, setCalendarModalOpen, setSelectedDate, selectedDate, totalPrice, handleGuestChange, formatDate, guests}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Get the selected tour date object to access guides
    const selectedTourDate = upcomingDates.find(d => d.date === selectedDate);
    const guides = selectedTourDate?.guides || [];

    return (
        <div className="lg:col-span-1 mt-10 lg:mt-0">
            <div className="sticky top-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-extrabold text-gray-900">${tour.price.toFixed(2)}</span>
                        <span className="text-gray-600 ml-1">/ {t('per_person')}</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.select_date')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {upcomingDates.map((d) => (
                                    <button key={d.date} onClick={() => setSelectedDate(d.date)} className={`p-2 rounded-lg border text-center transition-colors text-sm ${selectedDate === d.date ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500' : 'border-gray-300 hover:border-gray-500 cursor-pointer'}`}>
                                        <div className="font-bold">{formatDate(d.date, { day: 'numeric' })}
                                        </div>
                                        <div className="text-xs">{formatDate(d.date, { month: 'short' })}
                                        </div>
                                    </button>))}
                                <button onClick={() => setCalendarModalOpen(true)} className="p-2 rounded-lg border border-dashed border-gray-400 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex flex-col items-center justify-center space-y-1 col-span-3 mt-1 cursor-pointer">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span className="font-medium text-xs">{t('booking.more_dates')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Guide Information Section */}
                        {selectedDate && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.tour_guides')}</label>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    {guides.length > 0 ? (
                                        <div className="space-y-2">
                                            {guides.map((guide) => (
                                                <div key={guide.id} className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                                                        {guide.email && (
                                                            <div className="text-xs text-gray-500">{guide.email}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-3 text-gray-500">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="text-sm">
                                                {t('booking.guide_not_assigned')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('booking.guests')}</label>
                            <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                                <span className="text-gray-700">{t('booking.number_of_guests')}</span>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleGuestChange(-1)} disabled={guests <= 1} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <Minus className="w-4 h-4"/>
                                    </button>
                                    <span className="font-bold text-lg w-6 text-center">{guests}</span>
                                    <button onClick={() => handleGuestChange(1)} disabled={guests >= tour.maxGuests} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <Plus className="w-4 h-4"/>
                                    </button>
                                </div></div>
                        </div>
                    </div>
                    <div className="my-6 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center text-lg"><span className="font-bold text-gray-900">{t('booking.total')}</span><span className="font-extrabold text-2xl text-gray-900">${totalPrice}</span></div>
                        <p className="text-xs text-gray-500 text-right">{t('booking.includes_taxes_fees')}</p>
                    </div>
                    <button onClick={() => navigate("/tourist/booking-review")} disabled={!selectedDate} className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-colors bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer">{selectedDate ? t('booking.request_booking') : t('booking.select_date_first')}</button>
                    <p className="text-xs text-gray-500 text-center mt-3">{t('booking.wont_be_charged')}</p>
                </div>
            </div>
        </div>
    )
};

export default BookingCard;