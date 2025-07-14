import { useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/api/bookings`;

const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * A single, powerful function to fetch bookings.
     * It can filter by owner, tour, and other search criteria.
     * @param {object} params - The query parameters.
     * @param {number} [params.ownerId] - The ID of the owner.
     * @param {number} [params.tourId] - The ID of the tour.
     * @param {string} [params.status] - The booking status.
     * @param {string} [params.date] - The date in YYYY-MM-DD format.
     * @param {string} [params.search] - The search term.
     */
    const fetchBookings = useCallback(async (params = {}) => {
        // A request must have at least an ownerId or a tourId to be valid.
        // This check was missing in your new version.
        if (!params.ownerId && !params.tourId) {
            setBookings([]); // Clear bookings if no valid ID is provided
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // This logic is much cleaner. It uses the flexible /search endpoint
            // for all requests and lets Axios build the query string.
            const response = await axios.get(`${API_URL}/search`, {
                params: params,
                withCredentials: true,
            });
            setBookings(response.data);
        } catch (err) {
            setError(err);
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    }, []); // This function is self-contained, so it has no dependencies.

    /**
     * Fetches statistics for a specific owner.
     * @param {number} ownerId - The ID of the owner.
     */
    const fetchStats = useCallback(async (ownerId) => {
        if (!ownerId) return;
        try {
            const response = await axios.get(
                `${API_URL}/owner/stats`,
                { withCredentials: true }
            );
            setStats(response.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    }, []);

    // Note: The automatic useEffect is removed. The component using the hook
    // is now responsible for the initial fetch. This makes the hook more flexible.

    return {
        bookings,
        stats,
        loading,
        error,
        fetchBookings,
        fetchStats,
    };
};

export default useBookings;
