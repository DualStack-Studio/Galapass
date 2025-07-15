import { useState } from 'react';
import { BASE_URL } from '../config';
import { useTranslation } from 'react-i18next';

export const useMediaUpload = (tourId) => {
    const [media, setMedia] = useState([]);
    const [isUploading, setIsUploading] = useState({ image: false, video: false });
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();

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
                if (!response.ok) throw new Error(t('errors.upload_image_failed', { name: file.name }));
                return response.json();
            });
        });

        try {
            const results = await Promise.all(uploadPromises);
            setMedia(prev => [...prev, ...results]);
        } catch (error) {
            console.error(t('errors.image_upload_error'), error);
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
                throw new Error(t('errors.upload_video_failed'));
            }
        } catch (error) {
            console.error(t('errors.video_upload_error'), error);
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
                    const errorData = await response.json().catch(() => ({ error: t('errors.unknown_upload_error') }));
                    throw new Error(errorData.error || t('errors.upload_image_failed', { name: file.name }));
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
            console.error(t('errors.image_upload_error'), error.message);
        } finally {
            setIsUploading(prev => ({ ...prev, image: false }));
        }
    };

    const removeTourMedia = async (urlToRemove) => {
        if (!urlToRemove) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${BASE_URL}/api/tours/${tourId}/media/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlToRemove }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('errors.delete_failed'));
            }
            setMedia((prev) => prev.filter((m) => m.url !== urlToRemove));
        } catch (error) {
            console.error(t('errors.tour_media_delete_error'), error);
        } finally {
            setIsDeleting(false);
        }
    };

    const removeGeneralMedia = async (urlToRemove) => {
        if (!urlToRemove) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${BASE_URL}/api/media/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlToRemove }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t('errors.delete_failed'));
            }
            setMedia((prev) => prev.filter((m) => m.url !== urlToRemove));
        } catch (error) {
            console.error(t('errors.general_media_delete_error'), error);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        media,
        setMedia,
        isUploading,
        isDeleting,
        handleImageUpload,
        handleVideoUpload,
        handleGeneralImageUploads,
        removeTourMedia,
        removeGeneralMedia,
    };
};
