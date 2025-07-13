import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, CheckCircle2, Loader, AlertCircle } from 'lucide-react';
import StepBasicInfo from "../../components/OwnerView/TourCreation/StepBasicInfo.jsx";
import StepMedia from "../../components/OwnerView/TourCreation/StepMedia.jsx";
import StepDetails from "../../components/OwnerView/TourCreation/StepDetails.jsx";
import StepPricing from "../../components/OwnerView/TourCreation/StepPricing.jsx";
import StepSummary from "../../components/OwnerView/TourCreation/StepSummary.jsx";
import { useTourForm } from "../../hooks/useTourForm.js";
import useTourEnums from "../../hooks/useTourEnums.js";
import { useMediaUpload } from "../../hooks/useMediaUpload.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useTourCreation } from '../../hooks/UseTourCreation'; // This hook also has the updateTour method
import { useNavigate, useParams } from "react-router-dom";
import { fetchTour } from "../../api/tourApi.js"; // Assuming this fetches a single tour

const TourEditPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { tourId } = useParams(); // Get tourId from URL
    const { user } = useAuth();
    const ownerId = user?.id;

    // --- State Management ---
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const initialDataRef = useRef(null);

    // --- Custom Hooks ---
    const { formData, setFormData, handleInputChange, handleHighlightChange } = useTourForm();
    const { categories, tags: availableTags, locations, brings: availableBrings, destinations, durations, enumLoading, enumError } = useTourEnums();

    // CORRECTED: Use the unified `media` state from the hook
    const { media, setMedia, isUploading, handleImageUpload, handleVideoUpload, removeMedia } = useMediaUpload(tourId);

    const { companies, loading: companiesLoading, error: companiesError, updateTour } = useTourCreation(ownerId);

    const guides = companies.flatMap(company => company.guides || []);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchAndSetTourData = async () => {
            if (!tourId) {
                setError('Tour ID is missing.');
                setLoading(false);
                return;
            }
            try {
                const tourData = await fetchTour(tourId);
                console.log(tourData)

                const initialFormData = {
                    title: tourData.title || '',
                    description: tourData.description || '',
                    price: tourData.price || '',
                    // Handle cases where API returns an object with a key or just the key string
                    category: tourData.category?.key || tourData.category || '',
                    status: tourData.status || 'ACTIVE',
                    location: tourData.location?.key || tourData.location || '',
                    destination: tourData.destination?.key || tourData.destination || '',
                    duration: tourData.duration?.key || tourData.duration || '',
                    maxGuests: tourData.maxGuests || '',
                    companyId: String(tourData.company?.id || ''),
                    selectedGuides: tourData.guides?.map(g => String(g.id)) || [],
                    tags: tourData.tags || [],
                    brings: tourData.brings?.map(b => b.key || b) || [],
                    highlights: tourData.highlights?.length ? tourData.highlights : [''],
                };

                setFormData(initialFormData);
                setMedia(tourData.media || []);

                initialDataRef.current = {
                    formData: initialFormData,
                    media: tourData.media || []
                };

            } catch (err) {
                setError('Failed to load tour data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetTourData();
    }, [tourId, setFormData, setMedia]);


    // --- Step Validation ---
    const isStep1Valid = formData.title && formData.location && formData.category && formData.destination;
    const isStep2Valid = media.filter(m => m.type === 'IMAGE').length > 0;
    const isStep3Valid = formData.description && formData.companyId && formData.duration && formData.maxGuests && formData.selectedGuides?.length > 0 && formData.highlights?.some(h => h.trim() !== '') && formData.tags?.length > 0 && formData.brings?.length > 0;
    const isStep4Valid = formData.price;
    const isSaveDisabled = loading || saving || !isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid;

    // --- Loading & Error States ---
    if (loading || companiesLoading || enumLoading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
    }
    if (companiesError || enumError || (error && !formData.title)) {
        return <div className="flex justify-center items-center min-h-screen"><p className="text-red-600 text-lg">{error || companiesError || enumError}</p></div>;
    }

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Name and location' },
        { id: 2, title: 'Media', description: 'Showcase your tour' },
        { id: 3, title: 'Details', description: 'Add the specifics' },
        { id: 4, title: 'Pricing', description: 'Set your price' }
    ];

    // --- Event Handlers ---
    const handleGuideToggle = (guideId) => setFormData(prev => ({ ...prev, selectedGuides: prev.selectedGuides.includes(guideId) ? prev.selectedGuides.filter(id => id !== guideId) : [...prev.selectedGuides, guideId] }));
    const handleTagToggle = (tag) => setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));
    const handleBringToggle = (bringId) => setFormData(prev => ({ ...prev, brings: prev.brings.includes(bringId) ? prev.brings.filter(id => id !== bringId) : [...prev.brings, bringId] }));

    const handleNextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const handlePrevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleFinalSave = async (e) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        setSaving(true);
        setError('');

        const patchData = {
            ...formData,
            media: media,
            highlights: formData.highlights.filter(h => h && h.trim() !== ''),
            price: parseFloat(formData.price),
            maxGuests: parseInt(formData.maxGuests),
            company: { id: parseInt(formData.companyId) },
            guides: formData.selectedGuides.map(id => ({ id: parseInt(id) })),
        };

        try {
            await updateTour(tourId, patchData);
            onSuccess?.();
            setCurrentStep(5);
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
                return <StepBasicInfo formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} categories={categories} locations={locations} destinations={destinations} isEdit={true} />;
            case 2:
                return <StepMedia media={media} onImageSelect={(files) => handleImageUpload(files)} onVideoSelect={(file) => handleVideoUpload(file)} onMediaRemove={removeMedia} isUploading={isUploading} tourId={tourId} />;
            case 3:
                return <StepDetails formData={formData} handleInputChange={handleInputChange} handleHighlightChange={handleHighlightChange} handleGuideToggle={handleGuideToggle} handleTagToggle={handleTagToggle} handleBringToggle={handleBringToggle} companies={companies} guides={guides} availableTags={availableTags} availableBrings={availableBrings} durations={durations} />;
            case 4:
                return <StepPricing formData={formData} handleInputChange={handleInputChange} />;
            case 5:
                return <StepSummary tour={formData} isEdit={true} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <button onClick={() => navigate('/owner/dashboard?tab=tours')} className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"><ArrowLeft className="h-5 w-5 mr-2" />Exit</button>
                        <div className="flex items-center space-x-8">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex items-center ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200'}`}>{currentStep > step.id ? <CheckCircle2 size={16}/> : step.id}</div><div className="ml-3 hidden sm:block"><div className="text-sm font-medium">{step.title}</div><div className="text-xs">{step.description}</div></div></div>
                                    {index < steps.length - 1 && <div className={`w-12 h-px ${currentStep > step.id ? 'bg-black' : 'bg-gray-200'}`} />}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="w-16" />
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
                {error && <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-800">{error}</p></div>}
                <div>{renderStepContent()}</div>
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {currentStep > 1 && currentStep < 5 ? (
                        <button onClick={handlePrevStep} className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg cursor-pointer">
                            Back
                        </button>) : <div />}
                    {currentStep < 4 ? (
                        <button onClick={handleNextStep} className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 cursor-pointer">
                            Next
                        </button>
                    ) : <div />}
                    {currentStep === 4 && (
                        <button onClick={handleFinalSave} disabled={isSaveDisabled} className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 flex items-center space-x-2 cursor-pointer">
                            {saving ? <><Loader className="animate-spin h-4 w-4" /><span>Saving...</span></> : <><Save className="h-4 w-4" /><span>Save Changes</span></>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourEditPage;
