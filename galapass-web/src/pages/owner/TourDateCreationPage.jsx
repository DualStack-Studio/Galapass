import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Plus, Edit3, Trash2, Save, X, DollarSign, Users, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TourDatesCalendar from "../../components/OwnerView/TourDates/TourDatesCalendar.jsx";
import TourInfo from "../../components/OwnerView/TourDates/TourInfo.jsx";
import TourDateForm from "../../components/OwnerView/TourDates/TourDateForm.jsx";
import UpcomingTourDates from "../../components/OwnerView/TourDates/UpcomingTourDates.jsx";
import useTourDates from "../../hooks/UseTourDates.js";
import {useParams} from "react-router-dom";
import {fetchTour} from "../../api/tourApi.js";

const TourDatesManager = () => {
    const { tourId } = useParams()
    const [tour, setTour] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isCreating, setIsCreating] = useState(false);
    const [editingDate, setEditingDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
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
        const tourDateToDelete = tourDates.find(td => td.id === tourDateId)
        const totalPeopleBooked = tourDateToDelete?.bookings.reduce(
            (sum, currentBooking) => sum + currentBooking.numberOfPeople,
            0
        ) || 0;
        if (tourDateToDelete && totalPeopleBooked > 0) {
            console.log('Cannot delete tour date with existing bookings');
            return;
        }

        await deleteTourDate(tourDateId);
        handleCancelEdit();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tourArray = await fetchTour(tourId);
                setTour(tourArray[0]);
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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
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

                        {/* Create/Edit Form */}
                        {isCreating && (
                            <TourDateForm
                                editingDate={editingDate}
                                newTourDate={newTourDate}
                                setNewTourDate={setNewTourDate}
                                handleSaveTourDate={handleSaveTourDate}
                                handleCancelEdit={handleCancelEdit}
                                handleDeleteTourDate={handleDeleteTourDate}
                                totalPeopleBooked={totalPeopleBooked}
                            />
                        )}

                        {/* Upcoming Tour Dates */}
                        <UpcomingTourDates
                            tourDates={tourDates}
                            setEditingDate={setEditingDate}
                            setNewTourDate={setNewTourDate}
                            setIsCreating={setIsCreating}
                            totalPeopleBooked={totalPeopleBooked}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDatesManager;