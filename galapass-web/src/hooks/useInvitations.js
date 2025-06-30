const API_URL = 'http://localhost:8080/api/invitations';
import { useEffect, useState } from 'react';

export const fetchInvitations = async (ownerId) => {
    const response = await fetch(`${API_URL}/company/${ownerId}`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch invitations');
    return await response.json();
};

export const sendInvitation = async (payload) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to send invitation');
    return await response.json();
};

export const cancelInvitation = async (invitationId) => {
    const response = await fetch(`${API_URL}/${invitationId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to cancel invitation');
    return await response.json();
};

export const resendInvitation = async (invitationId) => {
    const response = await fetch(`${API_URL}/${invitationId}/resend`, {
        method: 'POST',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to resend invitation');
    return await response.json();
};

export const useInvitations = (companyId) => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadInvitations = async () => {
        try {
            setLoading(true);
            const data = await fetchInvitations(companyId);
            setInvitations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyId) loadInvitations();
    }, [companyId]);

    return { invitations, loading, error, refetch: loadInvitations };
};
