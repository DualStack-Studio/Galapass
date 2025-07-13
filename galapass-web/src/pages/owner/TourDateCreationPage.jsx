import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Plus, Edit3, Trash2, Save, X, DollarSign, Users, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TourDatesCalendar from "../../components/OwnerView/TourDates/TourDatesCalendar.jsx";
import TourInfo from "../../components/OwnerView/TourDates/TourInfo.jsx";
import TourDateFormModal from "../../components/OwnerView/TourDates/TourDateFormModal.jsx";
import UpcomingTourDates from "../../components/OwnerView/TourDates/UpcomingTourDates.jsx";
import useTourDates from "../../hooks/UseTourDates.js";
import {useNavigate, useParams} from "react-router-dom";
import {fetchTour} from "../../api/tourApi.js";
import ErrorModal from "../../components/ErrorModal.jsx";

const TourDatesManager = () => {
    const navigate = useNavigate();
    const { tourId } = useParams()
    const [tour, setTour] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isCreating, setIsCreating] = useState(false);
    const [editingDate, setEditingDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    const [newTourDate, setNewTourDate] = useState({
        date: null,
        price: '',
        maxGuests: '',
        available: true,
        bookings: [],
    });

    const {
        tourDates,
        setTourDates,
        createTourDate,
        deleteTourDate,
        updateTourDateLocal,
        cancelTourDate,
        refetchTourDates
    } = useTourDates(tourId);


    const totalPeopleBooked = (editingDate?.bookings ?? []).reduce(
        (sum, booking) => sum + (booking.numberOfPeople || 0),
        0
    );

    const handleSaveTourDate = async () => {
        if (!newTourDate.date || !newTourDate.price || !newTourDate.maxGuests) {
            toast.error('Please fill in all fields');
            return;
        }

        const tourDateData = {
            date: newTourDate.date,
            price: parseFloat(newTourDate.price),
            maxGuests: parseInt(newTourDate.maxGuests),
            available: newTourDate.available,
            bookings: newTourDate.bookings,
        };

        if (editingDate) {
            const updated = {
                ...editingDate,
                ...tourDateData
            };
            updateTourDateLocal(updated);
            toast.success('Tour date updated locally (not saved to backend)');
        } else {
            await createTourDate(tourDateData);
        }

        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setIsCreating(false);
        setEditingDate(null);
        setNewTourDate({
            date: null,
            price: '',
            maxGuests: '',
            available: true
        });
    };

    const handleDeleteTourDate = async (tourDateId) => {
        try {
            await deleteTourDate(tourDateId);
            handleCancelEdit();
        } catch (error) {
            handleCancelEdit();
            setErrorModal({ isOpen: true, message: error.message });
        }
    };

    const handleCancelTourDate = async (tourDateId) => {
        try {
            await cancelTourDate(tourDateId);
            handleCancelEdit();
        } catch (error) {
            handleCancelEdit();
            setErrorModal({ isOpen: true, message: error.message });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tour = await fetchTour(tourId);
                setTour(tour);
            } catch (err) {
                console.error('Failed to fetch tour:', err);
                setError('Failed to load tour');
            } finally {
                setLoading(false);
            }
        };

        if (tourId) {
            fetchData();
        }
    }, [tourId]);

    if (loading) return <div className="p-4 text-gray-600">Loading tour...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!tour) return <div className="p-4 text-gray-600">Tour not found</div>;

    return (
        // The main container for the page
        <div className="min-h-screen bg-white">
            {/* The Modal is now rendered here, at the top level */}
            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: '' })}
                message={errorModal.message}
            />

            {isCreating && (
                <TourDateFormModal
                    isOpen={isCreating}
                    editingDate={editingDate}
                    newTourDate={newTourDate}
                    setNewTourDate={setNewTourDate}
                    handleSaveTourDate={handleSaveTourDate}
                    handleCancelEdit={handleCancelEdit}
                    handleDeleteTourDate={handleDeleteTourDate}
                    handleCancelTourDate={handleCancelTourDate}
                    totalPeopleBooked={totalPeopleBooked}
                />
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/owner/dashboard?tab=tours")}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Tours</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Manage Tour Dates</h1>
                                <p className="text-gray-600">{tour.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2">
                        <TourDatesCalendar
                            tourDates={tourDates}
                            setTourDates={setTourDates}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            setNewTourDate={setNewTourDate}
                            setEditingDate={setEditingDate}
                            setIsCreating={setIsCreating}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            tour={tour}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tour Info */}
                        <TourInfo {...tour} />

                        {/* Upcoming Tour Dates */}
                        <UpcomingTourDates
                            tourDates={tourDates}
                            setEditingDate={setEditingDate}
                            setNewTourDate={setNewTourDate}
                            setIsCreating={setIsCreating}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDatesManager;
