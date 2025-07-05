import { useState } from 'react';

export const useImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (files) => {
        setIsUploading(true);
        const newImages = [];

        for (const file of files) {
            try {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const response = await fetch('http://localhost:8080/api/upload/image', {
                    method: 'POST',
                    credentials: 'include',
                    body: formDataUpload,
                });

                if (response.ok) {
                    const data = await response.json();
                    newImages.push({
                        id: Date.now() + Math.random(),
                        url: data.imageUrl,
                        file,
                    });
                }
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }

        setUploadedImages((prev) => [...prev, ...newImages]);
        setIsUploading(false);
    };

    const removeImage = (imageId) => {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    return {
        uploadedImages,
        isUploading,
        handleImageUpload,
        removeImage,
        setUploadedImages,
    };
};
