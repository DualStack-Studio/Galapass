import { useState } from 'react';
import { BASE_URL } from '../config';

export const useMediaUpload = (tourId) => {
    const [media, setMedia] = useState([]);
    const [isUploading, setIsUploading] = useState({ image: false, video: false });
    const [isDeleting, setIsDeleting] = useState(false); // Add isDeleting state

    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(prev => ({ ...prev, image: true }));

        const uploadPromises = Array.from(files).map(file => {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            return fetch(`${BASE_URL}/api/tours/${tourId}/media/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formDataUpload,
            }).then(response => {
                if (!response.ok) throw new Error(`Upload failed for ${file.name}`);
                return response.json();
            });
        });

        try {
            const results = await Promise.all(uploadPromises);
            setMedia(prev => [...prev, ...results]);
        } catch (error) {
            console.error('An error occurred during image upload:', error);
        } finally {
            setIsUploading(prev => ({ ...prev, image: false }));
        }
    };

    const handleVideoUpload = async (file) => {
        if (!file) return;
        setIsUploading(prev => ({ ...prev, video: true }));

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await fetch(`${BASE_URL}/api/tours/${tourId}/media/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formDataUpload,
            });

            if (response.ok) {
                const newMedia = await response.json();
                setMedia(prev => [...prev, newMedia]);
            } else {
                throw new Error('Video upload failed');
            }
        } catch (error) {
            console.error('An error occurred during video upload:', error);
        } finally {
            setIsUploading(prev => ({ ...prev, video: false }));
        }
    };

    const handleGeneralImageUploads = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(prev => ({ ...prev, image: true }));

        const uploadPromises = Array.from(files).map(file => {
            const formData = new FormData();
            formData.append('file', file);

            return fetch(`${BASE_URL}/api/media/upload/image`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            }).then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Unknown upload error" }));
                    throw new Error(errorData.error || `Upload failed for ${file.name}`);
                }
                return response.json();
            }).then(result => ({
                url: result.url,
                type: 'IMAGE'
            }));
        });

        try {
            const newMedia = await Promise.all(uploadPromises);
            setMedia(prev => [...prev, ...newMedia]);
        } catch (error) {
            console.error('An error occurred during image upload:', error.message);
        } finally {
            setIsUploading(prev => ({ ...prev, image: false }));
        }
    };

    const removeTourMedia = async (urlToRemove) => {
        if (!urlToRemove) return;
        setIsDeleting(true); // Set deleting state to true
        try {
            const response = await fetch(`${BASE_URL}/api/tours/${tourId}/media/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlToRemove }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete media from server.');
            }
            setMedia((prev) => prev.filter((m) => m.url !== urlToRemove));
        } catch (error) {
            console.error('Error deleting tour media:', error);
        } finally {
            setIsDeleting(false); // Reset deleting state
        }
    };

    const removeGeneralMedia = async (urlToRemove) => {
        if (!urlToRemove) return;
        setIsDeleting(true); // Set deleting state to true
        try {
            const response = await fetch(`${BASE_URL}/api/media/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlToRemove }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete media from server.');
            }
            setMedia((prev) => prev.filter((m) => m.url !== urlToRemove));
        } catch (error) {
            console.error('Error deleting general media:', error);
        } finally {
            setIsDeleting(false); // Reset deleting state
        }
    };

    return {
        media,
        setMedia,
        isUploading,
        isDeleting, // Export the new state
        handleImageUpload,
        handleVideoUpload,
        handleGeneralImageUploads,
        removeTourMedia,
        removeGeneralMedia,
    };
};