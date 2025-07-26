import React, { useState, useEffect } from "react";
import { Save, X, Trash2, Calendar, AlertTriangle } from "lucide-react";
import CompactCalendar from "./CompactCalendar";
import ConfirmModal from "../ConfirmModal";
import { useTranslation } from 'react-i18next';

const TourDateFormModal = ({
                               isOpen,
                               editingDate,
                               newTourDate,
                               setNewTourDate,
                               handleSaveTourDate,
                               handleCancelEdit,
                               handleDeleteTourDate,
                               handleCancelTourDate,
                               totalPeopleBooked,
                               handleCreatePromotion,
                               handleDisableTourDate,
                               handleViewBookings,
                           }) => {
    const { t, i18n } = useTranslation();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(newTourDate.date || new Date());
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(isOpen);
    const [guides, setGuides] = useState([]);
    const [formData, setFormData] = useState({ selectedGuides: [] });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        // Fetch guides data here and set it to the state
        const fetchGuides = async () => {
            try {
                const response = await fetch('/api/guides'); // Replace with actual API endpoint
                const data = await response.json();
                setGuides(data);
            } catch (error) {
                console.error('Failed to fetch guides:', error);
            }
        };
        fetchGuides();
    }, []);

    // --- DERIVED STATE FOR LOGIC ---
    const isCreating = !editingDate;
    const hasBookings = totalPeopleBooked > 0;
    // Fields are editable only if creating a new date or editing a date with no bookings.
    const isEditable = isCreating || !hasBookings;
    const unbookedSpots = newTourDate.maxGuests - totalPeopleBooked;


    if (!isVisible) return null;



    const formatDate = (date) => {
        if (!date) return "";
        const lang = i18n.language || 'en';
        // Add fallbacks for translation keys
        const monthNames = t('calendar.monthNames', { returnObjects: true, lng: lang, defaultValue: [] });
        const dayNames = t('calendar.abreviatedDayNames', { returnObjects: true, lng: lang, defaultValue: [] });
        if (!monthNames.length || !dayNames.length) return date.toLocaleDateString(); // Fallback to native format
        const weekday = dayNames[date.getDay()];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const day = date.getDate();
        return `${weekday}, ${month} ${day}, ${year}`;
    };

    const handleDateSelect = (dateString) => {
        const parts = dateString.split('-');
        const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
        setNewTourDate(prev => ({ ...prev, date: localDate }));
        setIsCalendarOpen(false);
    };

    const getLocalDateString = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleConfirmDelete = () => {
        handleDeleteTourDate(editingDate.id);
    };

    const handleConfirmCancel = () => {
        handleCancelTourDate(editingDate.id);
    };

    const handleViewBookingsTourDate = () => {
        handleViewBookings(editingDate.id, formatDate(newTourDate.date));
    }

    const handleGuideToggle = (guideId) => {
        setFormData((prev) => {
            const isSelected = prev.selectedGuides.includes(guideId);
            const updatedGuides = isSelected
                ? prev.selectedGuides.filter((id) => id !== guideId)
                : [...prev.selectedGuides, guideId];
            return { ...prev, selectedGuides: updatedGuides };
        });
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
                onClick={handleCancelEdit}
            >
                <div
                    className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 ${isOpen ? 'animate-slide-up' : 'animate-slide-down'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{isCreating ? t('tour_dates.create_tour_date') : t('tour_dates.manage_tour_date')}</h3>
                        <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20}/></button>
                    </div>

                    <div className="space-y-5">
                        {/* --- FORM FIELDS --- */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tour_dates.date')}</label>
                            <div className="flex items-center">
                                <input type="text" value={newTourDate.date ? formatDate(newTourDate.date) : ""} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"/>
                                <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" disabled={!isEditable}><Calendar size={20}/></button>
                            </div>
                            {isCalendarOpen && <CompactCalendar isVisible={isCalendarOpen} onSelectDate={handleDateSelect} onClose={() => setIsCalendarOpen(false)} selectedDate={getLocalDateString(newTourDate.date)} position="down" currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}/>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tour_dates.price')}</label>
                            <input type="number" value={newTourDate.price} onChange={(e) => setNewTourDate(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="150" disabled={!isEditable}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tour_dates.max_guests')}</label>
                            <input type="number" value={newTourDate.maxGuests} onChange={(e) => setNewTourDate(prev => ({ ...prev, maxGuests: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="12" disabled={!isEditable}/>
                        </div>

                        {isEditable && (
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="available" checked={newTourDate.available} onChange={(e) => setNewTourDate(prev => ({ ...prev, available: e.target.checked }))} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">{t('tour_dates.available_for_booking')}</label>
                            </div>
                        )}

                        {/* --- ASSIGN GUIDES --- */}
                        {guides.length > 0 && (
                            <div>
                                <label className="block text-lg font-medium text-gray-900 mb-3">
                                    {t('stepDetails.assign_guides')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {guides.map((guide) => (
                                        <label
                                            key={guide.id}
                                            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedGuides.includes(String(guide.id))}
                                                onChange={() => handleGuideToggle(String(guide.id))}
                                                className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                                            />
                                            <span className="text-gray-900">{guide.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- BUTTON CONTAINER --- */}
                        <div className="pt-3">
                            <div className="space-y-3">
                                {/* Primary Actions */}
                                <div className="flex space-x-2">
                                    {isCreating && (
                                        <button onClick={handleSaveTourDate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><Save size={16}/><span>{t('tour_dates.create')}</span></button>
                                    )}
                                    {!isCreating && !hasBookings && (
                                        <>
                                            <button onClick={handleSaveTourDate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><Save size={16}/><span>{t('tour_dates.save_changes')}</span></button>
                                            <button onClick={() => setIsPromotionModalOpen(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><span>{t('tour_dates.promotion')}</span></button>
                                        </>
                                    )}
                                    {!isCreating && hasBookings && unbookedSpots > 0 && (
                                        <>
                                            <button onClick={() => setIsPromotionModalOpen(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><span>{t('tour_dates.promotion')}</span></button>
                                            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><span>{t('tour_dates.unavailable')}</span></button>
                                        </>
                                    )}
                                </div>

                                {/* Secondary Action */}
                                {!isCreating && hasBookings && (
                                    <button className="w-full flex items-center justify-center space-x-2 text-white bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded-lg cursor-pointer"
                                    onClick={() => handleViewBookingsTourDate()}
                                    >
                                        <span>{t('tour_dates.bookings')}</span>
                                        <span>({totalPeopleBooked})</span>
                                    </button>
                                )}

                                {/* Destructive Actions */}
                                {!isCreating && (
                                    hasBookings ? (
                                        <button
                                            onClick={() => setIsConfirmCancelOpen(true)}
                                            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                                        >
                                            <AlertTriangle size={16} />
                                            <span>{t('tour_dates.cancel_tour_date', { count: totalPeopleBooked })}</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsConfirmDeleteOpen(true)}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                            <span>{t('tour_dates.delete_tour_date')}</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-out { animation: fade-out 0.3s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                @keyframes slide-down { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
            `}</style>

            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('confirm_action')}
                message={t('tour_dates.delete_confirm')}
                confirmButtonText={t('tour_dates.delete')}
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
            <ConfirmModal
                isOpen={isConfirmCancelOpen}
                onClose={() => setIsConfirmCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                title={t('tour_dates.confirm_cancellation')}
                message={t('tour_dates.cancel_confirm', { count: totalPeopleBooked })}
                confirmButtonText={t('tour_dates.yes_cancel_tour')}
                confirmButtonColor="bg-orange-600 hover:bg-orange-700"
            />

            {isPromotionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{t('tour_dates.create_promotion')}</h3>
                            <button onClick={() => setIsPromotionModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('tour_dates.discount')}</label>
                                <input type="number" min="1" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('tour_dates.message')}</label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder={t('tour_dates.special_offer_placeholder')} />
                            </div>
                            <div className="text-sm text-gray-500">{t('tour_dates.unbooked_spots', { count: unbookedSpots })}</div>
                            <div className="flex space-x-2 pt-2">
                                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer">{t('tour_dates.create_promotion')}</button>
                                <button onClick={() => setIsPromotionModalOpen(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg cursor-pointer">{t('tour_dates.cancel')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TourDateFormModal;
