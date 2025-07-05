export const fetchTour = async (tourId) => {
    const response = await fetch(`http://localhost:8080/api/tours/${tourId}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tour');
    }

    return await response.json()
}