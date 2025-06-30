export const searchGuidesByName = async (name) => {
    const response = await fetch('http://localhost:8080/api/users/guides/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch guides');
    }

    return await response.json();
};

export const sendGuideInvitation = async (payload) => {
    const response = await fetch(`http://localhost:8080/api/invitations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invitation');
    }

    return await response.json();
};

