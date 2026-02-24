import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../config.js';

const useTourDates = (tourId) => {
    const [tourDates, setTourDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTourDates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/tour-dates/tour/${tourId}`,
                { withCredentials: true }
            );
            const formatted = res.data.map(td => ({
                ...td,
                date: new Date(td.date),
                bookedGuests: td.bookings?.length || 0
            }));
            setTourDates(formatted);
        } catch (err) {
            setError('Failed to fetch tour dates');
            toast.error('Failed to load tour dates');
        } finally {
            setLoading(false);
        }
    };

    const createTourDate = async (data) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/tour-dates`,
                { ...data, tourId },
                { withCredentials: true }
            );
            const newDate = {
                ...res.data,
                date: new Date(res.data.date),
                bookedGuests: res.data.bookings?.length || 0
            };
            setTourDates(prev => [...prev, newDate]);
            toast.success('Tour date created');
        } catch (err) {
            toast.error('Failed to create tour date');
        }
    };

    const deleteTourDate = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/tour-dates/${id}`, { withCredentials: true });
            setTourDates(prev => prev.filter(td => td.id !== id));
            toast.success('Tour date deleted');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const cancelTourDate = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/tour-dates/${id}/cancel`, {}, { withCredentials: true });

            setTourDates(prev => prev.map(td =>
                td.id === id ? { ...td, status: 'CANCELLED', available: false } : td
            ));
            toast.success('Tour date has been cancelled.');
        } catch (err)
        {
            const errorMessage = err.response?.data?.message || 'Failed to cancel the tour date.';
            throw new Error(errorMessage);
        }
    };

    // This function is for optimistic updates and does not need to change.
    const updateTourDateLocal = (updated) => {
        setTourDates(prev =>
            prev.map(td => (td.id === updated.id ? updated : td))
        );
    };

    useEffect(() => {
        if (tourId) {
            fetchTourDates();
        }
    }, [tourId]);

    return {
        tourDates,
        setTourDates,
        loading,
        error,
        createTourDate,
        deleteTourDate,
        updateTourDateLocal,
        cancelTourDate,
        refetchTourDates: fetchTourDates
    };
};

export default useTourDates;
