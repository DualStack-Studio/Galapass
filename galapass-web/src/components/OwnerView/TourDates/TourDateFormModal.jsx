// src/components/OwnerView/TourDates/TourDateFormModal.jsx
import React, { useState, useEffect } from "react";
import { Save, X, Trash2, Calendar, Clock, ChevronDown } from "lucide-react";
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../ConfirmModal';

const TourDateFormModal = ({
                               isOpen,
                               onClose,
                               editingDate,
                               selectedDate,
                               tour,
                               guides,
                               onSave,
                               onUpdate,
                               onDelete
                           }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        date: null,
        time: '09:00',
        price: '',
        maxGuests: '',
        available: true,
        guideIds: []
    });
    const [isVisible, setIsVisible] = useState(isOpen);
    const [guideSearchTerm, setGuideSearchTerm] = useState('');
    const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (editingDate) {
                const dateTime = new Date(editingDate.date);
                setFormData({
                    date: selectedDate,
                    time: dateTime.toTimeString().slice(0, 5),
                    price: editingDate.price.toString(),
                    maxGuests: editingDate.maxGuests.toString(),
                    available: editingDate.available,
                    guideIds: editingDate.guides ? editingDate.guides.map(guide => guide.id) : []
                });
            } else {
                setFormData({
                    date: selectedDate,
                    time: '09:00',
                    price: tour.price.toString(),
                    maxGuests: tour.maxGuests.toString(),
                    available: true,
                    guideIds: []
                });
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editingDate, selectedDate, tour]);

    if (!isVisible) return null;

    const isCreating = !editingDate;
    const totalPeopleBooked = editingDate ? (editingDate.bookings || []).reduce(
        (sum, booking) => sum + (booking.numberOfPeople || 0), 0
    ) : 0;
    const hasBookings = totalPeopleBooked > 0;

    const handleSave = async () => {
        if (!formData.date || !formData.time || !formData.price || !formData.maxGuests) {
            return;
        }

        const [hours, minutes] = formData.time.split(':');
        const fullDateTime = new Date(formData.date);
        fullDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const tourDateData = {
            date: fullDateTime,
            price: parseFloat(formData.price),
            maxGuests: parseInt(formData.maxGuests),
            available: formData.available,
            guides: formData.guideIds
        };

        try {
            if (editingDate) {
                await onUpdate({ ...editingDate, ...tourDateData });
            } else {
                await onSave(tourDateData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save tour date:', error);
        }
    };

    const handleDelete = async () => {
        if (!editingDate) return;

        try {
            await onDelete(editingDate.id);
            onClose();
        } catch (error) {
            console.error('Failed to delete tour date:', error);
            // You might want to show an error message to the user here
        }
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(false);
        handleDelete();
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Generate time options
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                options.push({ value: timeString, display: displayTime });
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();
    const selectedTimeOption = timeOptions.find(option => option.value === formData.time);

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {isCreating ? t('tour_dates.create_tour_date') : t('tour_dates.edit_tour_date')}
                        </h3>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Date Display */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('tour_dates.date')}
                            </label>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <Calendar size={20} className="text-gray-400 mr-3" />
                                <span className="text-gray-900 font-medium">
                                {formatDate(formData.date)}
                            </span>
                            </div>
                        </div>

                        {/* Custom Time Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('tour_dates.time')}
                            </label>
                            <div className="relative">
                                <div
                                    className={`flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                                        hasBookings ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={() => !hasBookings && setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                >
                                    <Clock size={20} className="text-gray-400 mr-3" />
                                    <span className="text-gray-900 font-medium flex-1">
                                        {selectedTimeOption?.display || 'Select time'}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-gray-400 transition-transform ${
                                            isTimeDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>

                                {isTimeDropdownOpen && !hasBookings && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {timeOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                                    formData.time === option.value ? 'bg-emerald-50 text-emerald-600' : 'text-gray-900'
                                                }`}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, time: option.value }));
                                                    setIsTimeDropdownOpen(false);
                                                }}
                                            >
                                                <div className="font-medium">{option.display}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('tour_dates.price')}
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="150"
                                disabled={hasBookings}
                            />
                        </div>

                        {/* Max Guests */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('tour_dates.max_guests')}
                            </label>
                            <input
                                type="number"
                                value={formData.maxGuests}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="12"
                                disabled={hasBookings}
                            />
                        </div>

                        {/* Guides */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('tour_dates.select_guides')}
                            </label>

                            {/* Selected Guides */}
                            <div className="mb-3 flex flex-wrap gap-2">
                                {formData.guideIds.map(guideId => {
                                    const guide = guides?.find(g => g.id === guideId);
                                    if (!guide) return null;
                                    return (
                                        <span
                                            key={guide.id}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-full"
                                        >
                                            {guide.name}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        guideIds: prev.guideIds.filter(id => id !== guide.id)
                                                    }));
                                                }}
                                                className="ml-2 text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Guide Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={guideSearchTerm}
                                    onChange={(e) => {
                                        setGuideSearchTerm(e.target.value);
                                        setIsGuideDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsGuideDropdownOpen(true)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder={t('tour_dates.search_guides')}
                                />

                                {isGuideDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {guides?.filter(guide =>
                                            !formData.guideIds.includes(guide.id) &&
                                            guide.name.toLowerCase().includes(guideSearchTerm.toLowerCase())
                                        ).map(guide => (
                                            <div
                                                key={guide.id}
                                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        guideIds: [...prev.guideIds, guide.id]
                                                    }));
                                                    setGuideSearchTerm('');
                                                    setIsGuideDropdownOpen(false);
                                                }}
                                            >
                                                <div className="font-medium text-gray-900">{guide.name}</div>
                                                <div className="text-sm text-gray-500">{guide.email}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Toggle */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="available"
                                checked={formData.available}
                                onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label htmlFor="available" className="text-sm font-medium text-gray-700">
                                {t('tour_dates.available_for_booking')}
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-colors cursor-pointer"
                            >
                                <Save size={18} />
                                <span>{isCreating ? t('tour_dates.create') : t('tour_dates.save_changes')}</span>
                            </button>

                            {!isCreating && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center space-x-2 font-semibold transition-colors cursor-pointer"
                            >
                                <Trash2 size={18} />
                                <span>{t('tour_dates.delete')}</span>
                            </button>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title={t('tour_dates.confirm_delete_title')}
                message={
                    hasBookings
                        ? t('tour_dates.confirm_delete_with_bookings', { count: totalPeopleBooked })
                        : t('tour_dates.confirm_delete_message')
                }
                confirmButtonText={t('tour_dates.delete')}
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </>
    );
};

export default TourDateFormModal;
