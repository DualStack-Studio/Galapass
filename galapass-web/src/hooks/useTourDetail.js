import { useState, useEffect } from 'react';
import { getTourById } from '/src/api/tourApi.js'; // Import the service function

/**
 * A custom hook to fetch and manage the state for a single tour's details.
 * @param {string} tourId - The ID of the tour.
 * @returns {{tour: object|null, loading: boolean, error: string|null}}
 */
export const useTourDetail = (tourId) => {
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Skip fetching if there's no tourId
        if (!tourId) {
            setLoading(false);
            return;
        }

        const loadTour = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error on new fetch
                const data = await getTourById(tourId);
                setTour(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        loadTour();
    }, [tourId]); // Re-run the effect only when tourId changes

    return { tour, loading, error };
};
