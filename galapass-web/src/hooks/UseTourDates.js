import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
const BASE_URL = 'http://localhost:8080';

const useTourDates = (tourId) => {
    const [tourDates, setTourDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const parseLocalDate = (dateString) => {
        if (!dateString) return null;
        const parts = dateString.split(/[-T]/);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const fetchTourDates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/tour-dates/tour/${tourId}`,
                { withCredentials: true }
            );
            const formatted = res.data.map(td => ({
                ...td,
                date: parseLocalDate(td.date),
                bookedGuests: td.maxGuests
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
                date: parseLocalDate(res.data.date),
                bookedGuests: res.data.maxGuests
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
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to cancel the tour date.';
            throw new Error(errorMessage);
        }
    };

    const updateTourDateLocal = (updated) => {
        setTourDates(prev =>
            prev.map(td => (td.id === updated.id ? updated : td))
        );
    };

    useEffect(() => {
        if (tourId) fetchTourDates();
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