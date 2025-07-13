import React, { useState, useEffect } from "react";
import { Save, X, Trash2, Calendar, AlertTriangle } from "lucide-react";
import CompactCalendar from "./CompactCalendar";
import ConfirmModal from "../ConfirmModal";

const TourDateFormModal = ({
                               isOpen, // 1. Add an isOpen prop
                               editingDate,
                               newTourDate,
                               setNewTourDate,
                               handleSaveTourDate,
                               handleCancelEdit,
                               handleDeleteTourDate,
                               handleCancelTourDate,
                               totalPeopleBooked
                           }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(newTourDate.date || new Date());
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

    // 2. Add state and effect for animation timing
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 3. Update render condition
    if (!isVisible) return null;

    const formatDate = (date) => {
        // ... (function remains the same)
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
    };

    const handleDateSelect = (dateString) => {
        // ... (function remains the same)
        const parts = dateString.split('-');
        const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
        setNewTourDate(prev => ({ ...prev, date: localDate }));
        setIsCalendarOpen(false);
    };

    const getLocalDateString = (date) => {
        // ... (function remains the same)
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

    const isEditing = Boolean(editingDate);
    const isEditable = totalPeopleBooked === 0 && isEditing;
    const isViewOnly = totalPeopleBooked > 0 && isEditing;
    const unbookedSpots = newTourDate.maxGuests - totalPeopleBooked;

    return (
        <>
            {/* 4. Conditionally apply animations */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
                onClick={handleCancelEdit}
            >
                <div
                    className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 ${isOpen ? 'animate-slide-up' : 'animate-slide-down'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingDate ? "Manage Tour Date" : "Create Tour Date"}</h3>
                        <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20}/></button>
                    </div>

                    <div className="space-y-5">
                        {/* Form fields and other content remain the same... */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="flex items-center">
                                <input type="text" value={newTourDate.date ? formatDate(newTourDate.date) : ""} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"/>
                                <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" disabled={!isEditable}><Calendar size={20}/></button>
                            </div>
                            {isCalendarOpen && <CompactCalendar isVisible={isCalendarOpen} onSelectDate={handleDateSelect} onClose={() => setIsCalendarOpen(false)} selectedDate={getLocalDateString(newTourDate.date)} position="down" currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}/>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input type="number" value={newTourDate.price} onChange={(e) => setNewTourDate(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="150" disabled={!isEditable}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                            <input type="number" value={newTourDate.maxGuests} onChange={(e) => setNewTourDate(prev => ({ ...prev, maxGuests: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="12" disabled={!isEditable}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="available" checked={newTourDate.available} onChange={(e) => setNewTourDate(prev => ({ ...prev, available: e.target.checked }))} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer" disabled={!isEditable}/>
                            <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">Available for booking</label>
                        </div>
                        <div className="flex space-x-2 pt-3">
                            {isEditing && isEditable && (
                                <button onClick={handleSaveTourDate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><Save size={16}/><span>Save Changes</span></button>
                            )}
                            {!isEditing && (
                                <button onClick={handleSaveTourDate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><Save size={16}/><span>Create</span></button>
                            )}
                            {/* Promotion button: show if editing and there are unbooked spots, regardless of bookings */}
                            {isEditing && unbookedSpots > 0 && (
                                <button onClick={() => setIsPromotionModalOpen(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><span>Promotion</span></button>
                            )}
                            {/* Set Unavailable button: show if editing, there are bookings, and there are unbooked spots */}
                            {isEditing && totalPeopleBooked > 0 && unbookedSpots > 0 && (
                                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><span>Unavailable</span></button>
                            )}
                        </div>

                        {editingDate && (
                            totalPeopleBooked > 0 ? (
                                <button
                                    onClick={() => setIsConfirmCancelOpen(true)}
                                    className="w-full mt-3 bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <AlertTriangle size={16} />
                                    <span>Cancel Tour Date ({totalPeopleBooked} bookings)</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsConfirmDeleteOpen(true)}
                                    className="w-full mt-3 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete Tour Date</span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* 5. Add the CSS animations */}
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
            </div>

            {/* Confirmation modals remain unchanged */}
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to permanently delete this tour date? This action cannot be undone."
                confirmButtonText="Delete"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
            <ConfirmModal
                isOpen={isConfirmCancelOpen}
                onClose={() => setIsConfirmCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Confirm Cancellation"
                message={`This will cancel the tour for all ${totalPeopleBooked} booked guests. They will be notified and refunded. This action cannot be undone.`}
                confirmButtonText="Yes, Cancel Tour"
                confirmButtonColor="bg-orange-600 hover:bg-orange-700"
            />

            {/* Promotion Modal */}
            {isPromotionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Create Promotion</h3>
                            <button onClick={() => setIsPromotionModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                <input type="number" min="1" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Special offer for remaining spots!" />
                            </div>
                            <div className="text-sm text-gray-500">Unbooked spots: {unbookedSpots}</div>
                            <div className="flex space-x-2 pt-2">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Create Promotion</button>
                                <button onClick={() => setIsPromotionModalOpen(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TourDateFormModal;

