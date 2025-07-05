import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8080';

export const useGuideDashboard = (guideId) => {
    const [companies, setCompanies] = useState([]);
    const [upcomingTours, setUpcomingTours] = useState([]);
    const [activeTours, setActiveTours] = useState([]);
    const [completedTours, setCompletedTours] = useState([]);
    const [tourHistory, setTourHistory] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [stats, setStats] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCompanies = async () => {
        const res = await fetch(`${API_URL}/api/guides/${guideId}/companies`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        setCompanies(data);
        return data;
    };

    const fetchTours = async () => {
        const [upcoming, active, completed, history] = await Promise.all([
            fetch(`${API_URL}/api/guides/${guideId}/tours/upcoming`, { credentials: 'include' }),
            fetch(`${API_URL}/api/guides/${guideId}/tours/active`, { credentials: 'include' }),
            fetch(`${API_URL}/api/guides/${guideId}/tours/completed`, { credentials: 'include' }),
            fetch(`${API_URL}/api/guides/${guideId}/tours/history`, { credentials: 'include' }),
        ]);

        if (!upcoming.ok || !active.ok || !completed.ok || !history.ok)
            throw new Error('Failed to fetch one or more tour lists');

        setUpcomingTours(await upcoming.json());
        setActiveTours(await active.json());
        setCompletedTours(await completed.json());
        setTourHistory(await history.json());
    };

    // Fetch invitations from all companies, then filter by guideId & status 'PENDING'
    const fetchInvitations = async (companiesList) => {
        if (!companiesList.length) {
            setInvitations([]);
            return;
        }

        // Fetch invitations for all companies concurrently
        const invitationsArrays = await Promise.all(
            companiesList.map(async (company) => {
                const res = await fetch(`${API_URL}/api/invitations/company/${company.id}`, { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch invitations for company ' + company.id);
                return await res.json();
            })
        );

        // Flatten array of arrays and filter by guideId & PENDING status
        const allInvitations = invitationsArrays.flat();
        const guidePendingInvitations = allInvitations.filter(
            (inv) => inv.guideId === guideId && inv.status === 'PENDING'
        );

        setInvitations(guidePendingInvitations);
    };

    const fetchStats = async () => {
        const res = await fetch(`${API_URL}/api/guides/${guideId}/dashboard-stats`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        setStats(await res.json());
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const companiesList = await fetchCompanies();
            await Promise.all([
                fetchTours(),
                fetchInvitations(companiesList),
                fetchStats(),
            ]);
        } catch (err) {
            console.error('Error fetching guide dashboard:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!guideId) return;
        fetchAll();
    }, [guideId]);

    return {
        companies,
        upcomingTours,
        activeTours,
        completedTours,
        tourHistory,
        invitations,
        stats,
        loading,
        error,
        refetch: fetchAll,
    };
};
