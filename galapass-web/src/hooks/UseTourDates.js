import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
const BASE_URL = 'http://localhost:8080';

const useTourDates = (tourId) => {
    const [tourDates, setTourDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Parses a date string (like 'YYYY-MM-DD') into a local Date object
     * to prevent timezone-related "one day off" errors.
     * @param {string} dateString - The date string to parse.
     * @returns {Date} A Date object in the user's local timezone.
     */
    const parseLocalDate = (dateString) => {
        if (!dateString) return null;
        // Split the date string to get year, month, and day parts.
        const parts = dateString.split(/[-T]/);
        // Create a new Date using the parts. The month is 0-indexed.
        // This constructor creates the date in the user's local timezone.
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const fetchTourDates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/tour-dates/tour/${tourId}`,
                { withCredentials: true }
            );

            // ✅ FIX: Use the robust local date parsing function
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

            // ✅ FIX: Also apply the fix to newly created dates for consistency
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
            console.log('Failed to delete tour date');
            toast.error('Failed to delete tour date');
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
        refetchTourDates: fetchTourDates
    };
};

export default useTourDates;