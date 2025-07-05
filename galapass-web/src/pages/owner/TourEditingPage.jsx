import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Edit3, Eye, Trash2, AlertCircle, Check, MapPin, DollarSign, Clock, Users, Building2, Upload, Camera } from 'lucide-react';
import StepBasicInfo from "../../components/OwnerView/TourCreation/StepBasicInfo.jsx";
import StepPhotos from "../../components/OwnerView/TourCreation/StepPhotos.jsx";
import StepDetails from "../../components/OwnerView/TourCreation/StepDetails.jsx";
import StepPricing from "../../components/OwnerView/TourCreation/StepPricing.jsx";
import {useTourForm} from "../../hooks/useTourForm.js";
import useTourEnums from "../../hooks/useTourEnums.js";
import {useImageUpload} from "../../hooks/useImageUpload.js";
import {useAuth} from "../../contexts/AuthContext.jsx";
import { useTourCreation } from '../../hooks/UseTourCreation';
import {useNavigate, useParams} from "react-router-dom";
import StepSummary from "../../components/OwnerView/TourCreation/StepSummary.jsx";
import {fetchTour} from "../../api/tourApi.js";

const TourEditPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { tourId } = useParams(); // Get tourId from URL params
    const { user } = useAuth();
    const ownerId = user?.id;

    const { companies, loading: companiesLoading, error: companiesError } = useTourCreation(ownerId);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const fileInputRef = useRef(null);
    const initialDataRef = useRef({ formData: null, uploadedImages: null });

    const {
        formData,
        setFormData,
        handleInputChange,
        handleHighlightChange
    } = useTourForm();

    const { categories, tags: availableTags, locations, enumLoading, enumError } = useTourEnums();
    const {
        uploadedImages,
        setUploadedImages,
        isUploading,
        handleImageUpload,
        removeImage
    } = useImageUpload();

    const guides = companies.flatMap(company => company.guides || []);

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Title, category & location' },
        { id: 2, title: 'Photos', description: 'Visual content' },
        { id: 3, title: 'Details', description: 'Description & specifics' },
        { id: 4, title: 'Pricing', description: 'Set your price' }
    ];

    // Fetch tour data on component mount
    useEffect(() => {
        const fetchTourData = async () => {
            if (!tourId) {
                setError('Tour ID is required');
                setLoading(false);
                return;
            }

            try {
                const tourArray = await fetchTour(tourId);
                const tour = tourArray[0];

                // Populate form data with existing tour data
                setFormData({
                    title: tour.title || '',
                    description: tour.description || '',
                    price: tour.price || '',
                    category: tour.category || '',
                    status: tour.status || 'ACTIVE',
                    location: tour.location || '',
                    duration: tour.duration || '',
                    maxGuests: tour.maxGuests || '',
                    companyId: String(tour.company?.id || ''),
                    selectedGuides: tour.guides?.map(guide => String(guide.id)) || [],
                    tags: tour.tags || [],
                    highlights: tour.highlights || ['']
                });

                initialDataRef.current = {
                    formData: {
                        title: tour.title || '',
                        description: tour.description || '',
                        price: tour.price || '',
                        category: tour.category || '',
                        status: tour.status || 'ACTIVE',
                        location: tour.location || '',
                        duration: tour.duration || '',
                        maxGuests: tour.maxGuests || '',
                        companyId: String(tour.company?.id || ''),
                        selectedGuides: tour.guides?.map(guide => String(guide.id)) || [],
                        tags: tour.tags || [],
                        highlights: tour.highlights || ['']
                    },
                    uploadedImages: tour.photoUrls?.map((url, index) => ({
                        url,
                        file: null,
                        id: `existing-${index}`
                    })) || []
                };

                // Set uploaded images
                if (tour.photoUrls && tour.photoUrls.length > 0) {
                    const imageObjects = tour.photoUrls.map((url, index) => ({
                        url,
                        file: null,
                        id: `existing-${index}`
                    }));
                    setUploadedImages(imageObjects);
                }

            } catch (err) {
                console.error('Error fetching tour:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTourData();
    }, [tourId, setFormData, setUploadedImages]);

    useEffect(() => {
        if (!initialDataRef.current.formData) return;

        const isEqual = (
            JSON.stringify(formData) === JSON.stringify(initialDataRef.current.formData) &&
            JSON.stringify(uploadedImages.map(img => img.url)) === JSON.stringify(initialDataRef.current.uploadedImages.map(img => img.url))
        );

        setUnsavedChanges(!isEqual);
    }, [formData, uploadedImages]);

    // Track changes to form data
    useEffect(() => {
        const handleFormChange = () => {
            setError('');
            setSuccessMessage('');
        };

        // You can add more sophisticated change detection here
        handleFormChange();
    }, [formData, uploadedImages]);

    const handleReset = () => {
        if (!initialDataRef.current.formData) return;

        setFormData(initialDataRef.current.formData);
        setUploadedImages(initialDataRef.current.uploadedImages);
        setUnsavedChanges(false);
        setError('');
        setSuccessMessage('');
    };

    if (loading || companiesLoading || enumLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (companiesError || enumError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-600 text-lg">{companiesError || enumError}</p>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">{error}</p>
                    <button
                        onClick={() => navigate('/owner/dashboard')}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

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

    // Step validation (same as creation page)
    const isStep1Valid = formData.title && formData.location && formData.category;
    const isStep2Valid = uploadedImages.length > 0;
    const isStep3Valid = formData.description && formData.companyId && formData.duration && formData.maxGuests && formData.selectedGuides.length > 0 && formData.highlights.some(h => h.trim() !== '') && formData.tags.length > 0;
    const isStep4Valid = formData.price;

    const isSaveDisabled =
        saving ||
        !isStep1Valid ||
        !isStep2Valid ||
        !isStep3Valid ||
        !isStep4Valid ||
        !unsavedChanges;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        const tourData = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            location: formData.location,
            status: formData.status?.toUpperCase(),
            photoUrls: uploadedImages.map(img => img.url),
            companyId: parseInt(formData.companyId),
            guideIds: formData.selectedGuides.map(id => parseInt(id)),
            tags: formData.tags,
            duration: formData.duration,
            maxGuests: parseInt(formData.maxGuests),
            highlights: formData.highlights
        };

        try {
            const response = await fetch(`http://localhost:8080/api/tours/${tourId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(tourData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update tour');
            }

            const updatedTour = await response.json();

            setCurrentStep(5);

            if (onSuccess) {
                onSuccess(updatedTour);
            }

        } catch (err) {
            console.error('Error updating tour:', err);
            setError(err.message);
        } finally {
            setSaving(false);
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
                        isEdit={true}
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
                        isEdit={true}
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
                        isEdit={true}
                    />
                );

            case 4:
                return (
                    <StepPricing
                        formData={formData}
                        handleInputChange={handleInputChange}
                        isEdit={true}
                    />
                );

            case 5:
                return <StepSummary tour={formData} handleInputChange={handleInputChange} isEdit={true} />;

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

                        {/* Step Progress */}
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

                        <div className="flex items-center space-x-3">
                            {successMessage && (
                                <div className="flex items-center text-green-600">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{successMessage}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}
                {unsavedChanges && currentStep < 4 && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800 text-sm">You have unsaved changes</p>
                    </div>
                )}
                <div>
                    {renderStepContent()}
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {currentStep > 1 && currentStep < 4 ? (
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        >
                            Back
                        </button>
                    ) : <div />}

                    {unsavedChanges && currentStep < 4 && (
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 text-gray-600 hover:text-black hover:underline transition-colors cursor-pointer"
                        >
                            Reset Changes
                        </button>
                    )}

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
                            onClick={handleSave}
                            disabled={isSaveDisabled}
                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Save Changes</span>
                                </>
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

export default TourEditPage;