import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const useBookings = ({ ownerId, status, date, search }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        if (!ownerId) return;

        setLoading(true);
        setError(null);

        try {
            let response;
            if (status || date || search) {
                // Search endpoint
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                if (date) params.append('date', date);
                if (search) params.append('search', search);

                response = await axios.get(
                    `${API_URL}/api/bookings/owner/${ownerId}/search?${params.toString()}`,
                    { withCredentials: true }
                );

            } else {
                // Basic fetch endpoint
                response = await axios.get(
                    `${API_URL}/api/bookings/owner`,
                    { withCredentials: true }
                );
            }

            setBookings(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [ownerId, status, date, search]);

    return { bookings, loading, error, refetch: fetchBookings };
};

export default useBookings;