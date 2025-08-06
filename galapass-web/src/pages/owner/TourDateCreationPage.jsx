// src/pages/owner/TourDateCreationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowLeft, Plus, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { fetchTour } from "../../api/tourApi.js";
import { useTranslation } from "react-i18next";
import TourDatesCalendar from "../../components/OwnerView/TourDates/TourDatesCalendar.jsx";
import TourDateSelectionModal from "../../components/OwnerView/TourDates/TourDateSelectionModal.jsx";
import TourDateFormModal from "../../components/OwnerView/TourDates/TourDateFormModal.jsx";
import useTourDates from "../../hooks/UseTourDates.js";
import ErrorModal from "../../components/ErrorModal.jsx";

const TourDatesManager = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { tourId } = useParams();

    // States
    const [tour, setTour] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingTourDate, setEditingTourDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    const [guides, setGuides] = useState([]);
    const [guidesLoaded, setGuidesLoaded] = useState(false);

    // Custom hook for tour dates
    const {
        tourDates,
        createTourDate,
        deleteTourDate,
        updateTourDateLocal,
        cancelTourDate,
        fetchGuidesByCompany
    } = useTourDates(tourId);

    // Fetch tour data
    useEffect(() => {
        const fetchTourData = async () => {
            if (!tourId) return;

            try {
                setLoading(true);
                const tourData = await fetchTour(tourId);
                setTour(tourData);
            } catch (err) {
                console.error('Failed to fetch tour:', err);
                setError('Failed to load tour');
            } finally {
                setLoading(false);
            }
        };

        fetchTourData();
    }, [tourId]);

    // Fetch guides only once when tour is loaded
    const fetchGuides = useCallback(async () => {
        if (!tour?.company?.id || guidesLoaded) return;

        try {
            const guidesData = await fetchGuidesByCompany(tour.company.id);
            setGuides(guidesData);
            setGuidesLoaded(true);
        } catch (err) {
            console.error('Failed to fetch guides:', err);
            setError('Failed to load guides');
        }
    }, [tour?.company?.id, fetchGuidesByCompany, guidesLoaded]);

    useEffect(() => {
        fetchGuides();
    }, [fetchGuides]);

    // Handle date click from calendar
    const handleDateClick = (clickedDate) => {
        setSelectedDate(clickedDate);
        setIsSelectionModalOpen(true);
    };

    // Handle tour date creation/editing
    const handleCreateTourDate = () => {
        setEditingTourDate(null);
        setIsFormModalOpen(true);
        setIsSelectionModalOpen(false);
    };

    const handleEditTourDate = (tourDate) => {
        setEditingTourDate(tourDate);
        setIsFormModalOpen(true);
        setIsSelectionModalOpen(false);
    };

    // Get tour dates for selected date
    const getSelectedDateTourDates = () => {
        if (!selectedDate || !tourDates) return [];

        return tourDates.filter(td => {
            const tourDateTime = new Date(td.date);
            return tourDateTime.toDateString() === selectedDate.toDateString();
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl">{error}</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <p className="text-xl">{t('tour_dates.tour_not_found')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Error Modal */}
            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: '' })}
                message={errorModal.message}
            />

            {/* Tour Date Selection Modal */}
            <TourDateSelectionModal
                isOpen={isSelectionModalOpen}
                onClose={() => setIsSelectionModalOpen(false)}
                selectedDate={selectedDate}
                tourDates={getSelectedDateTourDates()}
                onCreateNew={handleCreateTourDate}
                onEdit={handleEditTourDate}
            />

            {/* Tour Date Form Modal */}
            <TourDateFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                editingDate={editingTourDate}
                selectedDate={selectedDate}
                tour={tour}
                guides={guides}
                onSave={createTourDate}
                onUpdate={updateTourDateLocal}
                onDelete={deleteTourDate}
                onCancel={cancelTourDate}
            />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/owner/dashboard?tab=tours")}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>{t('tour_dates.backToTours')}</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{t('tour_dates.manageTourDates')}</h1>
                                <p className="text-lg text-gray-600 mt-1">{tour.title} - ${tour.price} - {tour.maxGuests} {t("booking_management.guests")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Calendar Section */}
                <div>
                    <TourDatesCalendar
                        tourDates={tourDates}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        onDateClick={handleDateClick}
                        selectedDate={selectedDate}
                        tour={tour}
                    />
                </div>
            </div>
        </div>
    );
};

export default TourDatesManager;