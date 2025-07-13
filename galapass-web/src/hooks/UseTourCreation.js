import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8080';

export const useTourCreation = (ownerId) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBasicCompanies = async () => {
        const res = await fetch(`${API_URL}/api/companies/basic-owner/${ownerId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch basic companies');
        }

        const data = await res.json();
        setCompanies(data);
    };

    const createDraftTour = async (draftData) => {
        const response = await fetch(`${API_URL}/api/tours/draft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(draftData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create draft tour');
        }

        // Return the full tour object from the backend, which now has an ID.
        return await response.json();
    };

    const updateTour = async (tourId, patchData) => {
        const response = await fetch(`${API_URL}/api/tours/${tourId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(patchData)
        });

        console.log(patchData)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update tour');
        }

        return await response.json();
    };

    useEffect(() => {
        if (!ownerId) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                await fetchBasicCompanies();
            } catch (err) {
                console.error('Error fetching basic companies:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [ownerId]);

    return {
        companies,
        loading,
        error,
        createDraftTour,
        updateTour,
        refetch: fetchBasicCompanies
    };
};
