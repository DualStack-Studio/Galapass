import React, { useState } from "react";
import { Save, X, Trash2, Calendar, AlertTriangle } from "lucide-react";
import CompactCalendar from "./CompactCalendar";
import ConfirmModal from "../ConfirmModal";

const TourDateFormModal = ({
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

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
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

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleCancelEdit}>
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingDate ? "Edit Tour Date" : "Create Tour Date"}</h3>
                        <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"><X size={20}/></button>
                    </div>

                    <div className="space-y-5">
                        {/* Form fields */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="flex items-center">
                                <input type="text" value={newTourDate.date ? formatDate(newTourDate.date) : ""} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50"/>
                                <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"><Calendar size={20}/></button>
                            </div>
                            {isCalendarOpen && <CompactCalendar isVisible={isCalendarOpen} onSelectDate={handleDateSelect} onClose={() => setIsCalendarOpen(false)} selectedDate={getLocalDateString(newTourDate.date)} position="down" currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}/>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input type="number" value={newTourDate.price} onChange={(e) => setNewTourDate(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="150"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                            <input type="number" value={newTourDate.maxGuests} onChange={(e) => setNewTourDate(prev => ({ ...prev, maxGuests: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="12"/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="available" checked={newTourDate.available} onChange={(e) => setNewTourDate(prev => ({ ...prev, available: e.target.checked }))} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"/>
                            <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">Available for booking</label>
                        </div>
                        <div className="flex space-x-2 pt-3">
                            <button onClick={handleSaveTourDate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><Save size={16}/><span>{editingDate ? 'Save Changes' : 'Create'}</span></button>
                            <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"><X size={16}/><span>Cancel</span></button>
                        </div>

                        {/* Conditional Button Logic */}
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
            </div>

            {/* Modal for Deleting */}
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to permanently delete this tour date? This action cannot be undone."
                confirmButtonText="Delete"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />

            {/* Modal for Cancelling */}
            <ConfirmModal
                isOpen={isConfirmCancelOpen}
                onClose={() => setIsConfirmCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Confirm Cancellation"
                message={`This will cancel the tour for all ${totalPeopleBooked} booked guests. They will be notified and refunded. This action cannot be undone.`}
                confirmButtonText="Yes, Cancel Tour"
                confirmButtonColor="bg-orange-600 hover:bg-orange-700"
            />
        </>
    );
};

export default TourDateFormModal;