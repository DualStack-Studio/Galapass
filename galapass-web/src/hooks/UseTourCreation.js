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
        refetch: fetchBasicCompanies
    };
};
