import { useState } from 'react';

export const useCompanyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        website: '',
        phone: '',
        email: '',
        specialties: [],
        teamSize: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSpecialtyToggle = (specialtyId) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter(id => id !== specialtyId)
                : [...prev.specialties, specialtyId]
        }));
    };

    return { formData, setFormData, handleInputChange, handleSpecialtyToggle };
};
