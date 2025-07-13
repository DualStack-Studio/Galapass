const API_URL = 'http://localhost:8080';

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

export const getTourById = async (tourId) => {
    const response = await fetch(`${API_URL}/api/tours/detail/${tourId}`);

    if (!response.ok) {
        // Create a more informative error message
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const convertLocationName = (string) => {
    const words = string.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ') + ', Galápagos';
}

export const convertDurationName = (string) => {
    const words = string.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
}