import React, { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Save, DollarSign, Tag, Camera, FileText, Building2, Upload, X, Plus, Star, Users, Clock, Globe } from 'lucide-react';
import StepBasicInfo from "../../components/OwnerView/TourCreation/StepBasicInfo.jsx";
import StepPhotos from "../../components/OwnerView/TourCreation/StepPhotos.jsx";
import StepDetails from "../../components/OwnerView/TourCreation/StepDetails.jsx";
import StepPricing from "../../components/OwnerView/TourCreation/StepPricing.jsx";
import {useTourForm} from "../../hooks/useTourForm.js";
import useTourEnums from "../../hooks/useTourEnums.js";
import {useImageUpload} from "../../hooks/useImageUpload.js";
import {useAuth} from "../../contexts/AuthContext.jsx";
import { useTourCreation } from '../../hooks/UseTourCreation';
import {useNavigate} from "react-router-dom";
import StepSummary from "../../components/OwnerView/TourCreation/StepSummary.jsx";

const TourCreationPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const ownerId = user?.id;

    const { companies, loading: companiesLoading, error: companiesError } = useTourCreation(ownerId);


    const [currentStep, setCurrentStep] = useState(1);
    const fileInputRef = useRef(null);
    const {
        formData,
        setFormData,
        handleInputChange,
        handleHighlightChange
    } = useTourForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { categories, tags: availableTags, locations ,enumLoading, enumError } = useTourEnums();
    const {
        uploadedImages,
        isUploading,
        handleImageUpload,
        removeImage
    } = useImageUpload();

    const guides = companies.flatMap(company => company.guides || []);

    const isStep1Valid = formData.title && formData.location && formData.category;
    const isStep2Valid = uploadedImages.length > 0;
    const isStep3Valid = formData.description && formData.companyId && formData.duration && formData.maxGuests && formData.selectedGuides.length > 0 && formData.highlights.some(h => h.trim() !== '') && formData.tags.length > 0;
    const isStep4Valid = formData.price;

    const isPublishDisabled =
        loading ||
        !isStep1Valid ||
        !isStep2Valid ||
        !isStep3Valid ||
        !isStep4Valid;

    if (companiesLoading || enumLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (companiesError || enumError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-600 text-lg">{enumError}</p>
            </div>
        );
    }


    const steps = [
        { id: 1, title: 'Basic Info', description: 'Tell us about your tour' },
        { id: 2, title: 'Photos', description: 'Show off your experience' },
        { id: 3, title: 'Details', description: 'Add the specifics' },
        { id: 4, title: 'Pricing', description: 'Set your price' }
    ];

    const handleGuideToggle = (guideId) => {
        setFormData(prev => ({
            ...prev,
            selectedGuides: prev.selectedGuides.includes(guideId)
                ? prev.selectedGuides.filter(id => id !== guideId)
                : [...prev.selectedGuides, guideId]
        }));
    };

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleImageUpload(files);
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const tourData = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            location: formData.location,
            photoUrls: uploadedImages.map(img => img.url),
            ownerId: ownerId,
            companyId: parseInt(formData.companyId),
            guideIds: formData.selectedGuides.map(id => parseInt(id)),
            tags: formData.tags,
            duration: formData.duration,
            maxGuests: parseInt(formData.maxGuests),
            highlights: formData.highlights
        };

        try {
            const response = await fetch('http://localhost:8080/api/tours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(tourData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create tour');
            }

            const createdTour = await response.json();

            onSuccess?.(createdTour);
            setCurrentStep(5);
        } catch (err) {
            console.error('Error creating tour:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepBasicInfo
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        categories={categories}
                        locations={locations}
                    />
                );

            case 2:
                return (
                    <StepPhotos
                        uploadedImages={uploadedImages}
                        handleImageUpload={handleImageUpload}
                        removeImage={removeImage}
                        isUploading={isUploading}
                        fileInputRef={fileInputRef}
                        handleFileSelect={handleFileSelect}
                    />
                );

            case 3:
                return (
                    <StepDetails
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleHighlightChange={handleHighlightChange}
                        handleGuideToggle={handleGuideToggle}
                        handleTagToggle={handleTagToggle}
                        companies={companies}
                        guides={guides}
                        availableTags={availableTags}
                    />
                );

            case 4:
                return (
                    <StepPricing
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );

            case 5:
                return <StepSummary {...{ tour: formData, handleInputChange }} />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <button
                            onClick={() => navigate('/owner/dashboard')}
                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Exit
                        </button>

                        <div className="flex items-center space-x-8">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex items-center ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200'
                                        }`}>
                                            {step.id}
                                        </div>
                                        <div className="ml-3 hidden sm:block">
                                            <div className="text-sm font-medium">{step.title}</div>
                                            <div className="text-xs">{step.description}</div>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 h-px ${currentStep > step.id ? 'bg-black' : 'bg-gray-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="w-16" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <div>
                    {renderStepContent()}
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {currentStep > 1 && currentStep < 4 ? (
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        >
                            Back
                        </button>
                    ) : <div />}

                    {currentStep < 4 ? (
                        <button
                            onClick={nextStep}
                            disabled={
                                (currentStep === 1 && !isStep1Valid) ||
                                (currentStep === 2 && !isStep2Valid) ||
                                (currentStep === 3 && !isStep3Valid)
                            }
                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Next
                        </button>
                    ) : currentStep === 4 ? (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isPublishDisabled}
                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <button className="cursor-pointer">
                                    <Save className="h-4 w-4" />
                                    <span>Publish Tour</span>
                                </button>
                            )}
                        </button>
                    ) : (
                        <div/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourCreationPage;