import {useState} from "react";

export const useTourForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        companyId: '',
        duration: '',
        maxGuests: '',
        highlights: ['', '', ''],
        tags: [],
        selectedGuides: [],
        brings: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleHighlightChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            highlights: prev.highlights.map((h, i) => (i === index ? value : h)),
        }));
    };

    return {
        formData,
        setFormData,
        handleInputChange,
        handleHighlightChange,
    };
};