import { useEffect, useState } from 'react';
import { BASE_URL } from '../config';

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
        const res = await fetch(`${BASE_URL}/api/guides/${guideId}/companies`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        setCompanies(data);
        return data;
    };

    const fetchTours = async () => {
        const [upcoming, active, completed, history] = await Promise.all([
            fetch(`${BASE_URL}/api/guides/${guideId}/tours/upcoming`, { credentials: 'include' }),
            fetch(`${BASE_URL}/api/guides/${guideId}/tours/active`, { credentials: 'include' }),
            fetch(`${BASE_URL}/api/guides/${guideId}/tours/completed`, { credentials: 'include' }),
            fetch(`${BASE_URL}/api/guides/${guideId}/tours/history`, { credentials: 'include' }),
        ]);

        if (!upcoming.ok || !active.ok || !completed.ok || !history.ok)
            throw new Error('Failed to fetch one or more tour lists');

        setUpcomingTours(await upcoming.json());
        setActiveTours(await active.json());
        setCompletedTours(await completed.json());
        setTourHistory(await history.json());
    };

    const fetchInvitations = async () => {
        const res = await fetch(`${BASE_URL}/api/guides/${guideId}/invitations`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch guide invitations');
        const allInvitations = await res.json();
        console.log("Guide invitations:", allInvitations);

        const guidePendingInvitations = allInvitations.filter(inv => inv.status === 'PENDING');
        setInvitations(guidePendingInvitations);
    };



    const fetchStats = async () => {
        const res = await fetch(`${BASE_URL}/api/guides/${guideId}/dashboard-stats`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        setStats(await res.json());
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            await fetchCompanies();
            await Promise.all([
                fetchTours(),
                fetchInvitations(),
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
