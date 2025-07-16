import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle2, Loader } from 'lucide-react';
import StepBasicInfo from "../../components/OwnerView/TourCreation/StepBasicInfo.jsx";
import StepMedia from "../../components/OwnerView/TourCreation/StepMedia.jsx";
import StepDetails from "../../components/OwnerView/TourCreation/StepDetails.jsx";
import StepPricing from "../../components/OwnerView/TourCreation/StepPricing.jsx";
import StepSummary from "../../components/OwnerView/TourCreation/StepSummary.jsx";
import { useTourForm } from "../../hooks/useTourForm.js";
import useTourEnums from "../../hooks/useTourEnums.js";
import { useMediaUpload } from "../../hooks/useMediaUpload.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useTourCreation } from '../../hooks/UseTourCreation';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const TourCreationPage = ({ onSuccess }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const ownerId = user?.id;

    // --- State Management ---
    const [currentStep, setCurrentStep] = useState(1);
    const [tourId, setTourId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- Custom Hooks ---
    const { formData, setFormData, handleInputChange, handleHighlightChange } = useTourForm();
    const { categories, tags: availableTags, locations, brings: availableBrings, destinations, durations, enumLoading, enumError } = useTourEnums();
    const { media, isUploading, handleImageUpload, handleVideoUpload, removeTourMedia, isDeleting } = useMediaUpload(tourId);
    const { companies, loading: companiesLoading, error: companiesError, createDraftTour, updateTour } = useTourCreation(ownerId);

    const guides = companies.flatMap(company => company.guides || []);

    // --- Step Validation ---
    const isStep1Valid = formData.title && formData.location && formData.category && formData.destination;
    const isStep2Valid = media.filter(m => m.type === 'IMAGE').length > 0;
    const isStep3Valid = formData.description && formData.companyId && formData.duration && formData.maxGuests && formData.selectedGuides?.length > 0 && formData.highlights?.some(h => h.trim() !== '') && formData.tags?.length > 0 && formData.brings?.length > 0;
    const isStep4Valid = formData.price;
    const isPublishDisabled = loading || !isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid;

    // --- Loading & Error States ---
    if (companiesLoading || enumLoading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
    }
    if (companiesError || enumError) {
        return <div className="flex justify-center items-center min-h-screen"><p className="text-red-600 text-lg">{enumError || companiesError}</p></div>;
    }

    const steps = [
        { id: 1, title: 'step_progress.step1_title', description: 'step_progress.step1_desc' },
        { id: 2, title: 'step_progress.step2_title', description: 'step_progress.step2_desc' },
        { id: 3, title: 'step_progress.step3_title', description: 'step_progress.step3_desc' },
        { id: 4, title: 'step_progress.step4_title', description: 'step_progress.step4_desc' }
    ];

    // --- Event Handlers ---
    const handleGuideToggle = (guideId) => setFormData(prev => ({ ...prev, selectedGuides: prev.selectedGuides.includes(guideId) ? prev.selectedGuides.filter(id => id !== guideId) : [...prev.selectedGuides, guideId] }));
    const handleTagToggle = (tag) => setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));
    const handleBringToggle = (bringId) => setFormData(prev => ({ ...prev, brings: prev.brings.includes(bringId) ? prev.brings.filter(id => id !== bringId) : [...prev.brings, bringId] }));

    const handleNextStep = async () => {
        if (currentStep === 1 && !tourId) {
            if (!isStep1Valid) return;
            setLoading(true);
            setError('');
            try {
                const draftData = { title: formData.title, category: formData.category, location: formData.location, destination: formData.destination, ownerId: ownerId };
                const newTour = await createDraftTour(draftData);
                setTourId(newTour.id);
                setCurrentStep(2);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (isPublishDisabled) return;
        setLoading(true);
        setError('');

        const finalTourData = {
            description: formData.description,
            price: parseFloat(formData.price),
            duration: formData.duration,
            maxGuests: parseInt(formData.maxGuests),
            highlights: formData.highlights.filter(h => h && h.trim() !== ''),
            tags: formData.tags,
            brings: formData.brings,
            media: media,
            status: 'ACTIVE',
            company: { id: parseInt(formData.companyId) },
            guides: formData.selectedGuides.map(id => ({ id: parseInt(id) })),
        };


        try {
            await updateTour(tourId, finalTourData);
            onSuccess?.();
            setCurrentStep(5);
        } catch (err) {
            console.error('Error publishing tour:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StepBasicInfo formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} categories={categories} locations={locations} destinations={destinations} />;
            case 2:
                return <StepMedia media={media} onImageSelect={(files) => handleImageUpload(files)} onVideoSelect={(file) => handleVideoUpload(file)} onMediaRemove={removeTourMedia} isUploading={isUploading} tourId={tourId} isDeleting={isDeleting} />;
            case 3:
                return <StepDetails formData={formData} handleInputChange={handleInputChange} handleHighlightChange={handleHighlightChange} handleGuideToggle={handleGuideToggle} handleTagToggle={handleTagToggle} handleBringToggle={handleBringToggle} companies={companies} guides={guides} availableTags={availableTags} availableBrings={availableBrings} durations={durations} />;
            case 4:
                return <StepPricing formData={formData} handleInputChange={handleInputChange} />;
            case 5:
                return <StepSummary tour={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <button onClick={() => navigate('/owner/dashboard?tab=tours')} className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"><ArrowLeft className="h-5 w-5 mr-2" />{t('exit')}</button>
                        <div className="flex items-center space-x-8">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex items-center ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200'}`}>{currentStep > step.id ? <CheckCircle2 size={16}/> : step.id}</div><div className="ml-3 hidden sm:block"><div className="text-sm font-medium">{t(step.title)}</div><div className="text-xs">{t(step.description)}</div></div></div>
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
                            {t('back')}
                        </button>) : <div />}
                    {currentStep < 4 ? (
                        <button onClick={handleNextStep} disabled={(currentStep === 1 && !isStep1Valid) || loading || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid)} className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center cursor-pointer">
                            {loading && currentStep === 1 ? <><Loader className="animate-spin h-4 w-4 mr-2" /><span>{t('saving')}</span></> : t('next')}
                        </button>
                    ) : <div />}
                    {currentStep === 4 && (
                        <button onClick={handleFinalSubmit} disabled={isPublishDisabled} className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer">
                            {loading ? <><Loader className="animate-spin h-4 w-4" /><span>{t('publishing')}</span></> : <><Save className="h-4 w-4" /><span>{t('publish_tour')}</span></>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourCreationPage;