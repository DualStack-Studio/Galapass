import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8080';

export const useOwnerDashboard = (ownerId) => {
    const [companies, setCompanies] = useState([]);
    const [tours, setTours] = useState([]);
    const [guides, setGuides] = useState([]);

    const [stats, setStats] = useState({
        companiesCount: 0,
        toursCount: 0,
        guidesCount: 0,
        revenue: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCompanies = async () => {
        const res = await fetch(`${API_URL}/api/companies/owner/${ownerId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch companies');
        }

        const data = await res.json();
        setCompanies(data);

        const extractedTours = data.flatMap(company => company.tours || []);
        const extractedGuides = data.flatMap(company => company.guides || []);

        setTours(extractedTours);
        setGuides(extractedGuides);
    };

    const fetchStats = async () => {
        const res = await fetch(`${API_URL}/api/owner-dashboard/stats/${ownerId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        const data = await res.json();

        setStats({
            companiesCount: data.totalCompanies,
            toursCount: data.totalTours,
            guidesCount: data.totalGuides,
            revenue: data.totalRevenue
        });
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchCompanies(), fetchStats()]);
        } catch (err) {
            console.error('Error fetching owner dashboard:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ownerId) return;
        fetchAll();
    }, [ownerId]);

    return {
        companies,
        tours,
        guides,
        stats,
        loading,
        error,
        refetch: fetchAll
    };
};