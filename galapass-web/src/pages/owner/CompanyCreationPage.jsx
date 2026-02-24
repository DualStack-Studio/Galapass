import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useCompanyForm } from '../../hooks/useCompanyForm';
import StepBasicInfo from '../../components/OwnerView/CompanyCreation/StepBasicInfo';
import StepBranding from '../../components/OwnerView/CompanyCreation/StepBranding';
import StepDetails from '../../components/OwnerView/CompanyCreation/StepDetails';
import useTourEnums from "../../hooks/useTourEnums.js";
import { useMediaUpload } from "../../hooks/useMediaUpload.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";
import StepPricing from "../../components/OwnerView/TourCreation/StepPricing.jsx";
import StepSummary from "../../components/OwnerView/CompanyCreation/StepSummary.jsx";
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../../config.js';

const CompanyCreationPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const ownerId = user?.id;
    const { formData, handleInputChange, handleSpecialtyToggle } = useCompanyForm();
    const [currentStep, setCurrentStep] = useState(1);
    const {
        media: uploadedImages,
        handleGeneralImageUploads,
        removeGeneralMedia,
        isUploading,
        isDeleting
    } = useMediaUpload();

    const uploadedLogo = uploadedImages[0] || null;

    const { locations } = useTourEnums();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();

    const steps = [
        { id: 1, title: t('basic_info'), description: t('company_essentials') },
        { id: 2, title: t('branding'), description: t('logo_and_identity') },
        { id: 3, title: t('details'), description: t('complete_profile') }
    ];

    const isStep1Valid = formData.name && formData.location;
    const isStep2Valid = uploadedLogo
    const isStep3Valid =
        formData.description &&
        formData.phone &&
        formData.email;

    const isPublishDisabled =
        loading ||
        !isStep1Valid ||
        !isStep3Valid;

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);

        const payload = {
            name: formData.name,
            ownerId: ownerId,
            phone: formData.phone,
            email: formData.email,
            description: formData.description,
            location: formData.location,
            logo: uploadedLogo?.url || ''
        };

        try {
            const response = await fetch(`${BASE_URL}/api/companies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                const errorText = await response.text();
                const errorMessage = contentType?.includes('application/json')
                    ? JSON.parse(errorText).message
                    : errorText;
                throw new Error(errorMessage || 'Failed to create company');
            }

            const createdCompany = await response.json();
            console.log('Company created:', createdCompany);

            onSuccess?.(createdCompany);
            setCurrentStep(4)
        } catch (error) {
            console.error('Error creating company:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleFileSelect = (file) => {
        if (file) {
            handleGeneralImageUploads([file]);
        }
    };

    const renderStep = () => {
        if (currentStep === 1)
            return <StepBasicInfo {...{ formData, handleInputChange, handleSpecialtyToggle, locations, isEdit: false }} />;
        if (currentStep === 2)
            return (
                <StepBranding
                    uploadedLogo={uploadedLogo}
                    handleFileSelect={handleFileSelect}
                    removeLogo={removeGeneralMedia}
                    isUploading={isUploading.image}
                    isDeleting={isDeleting}
                />
            );
        if (currentStep === 3)
            return <StepDetails {...{ formData, handleInputChange }} />;
        if (currentStep === 4)
            return <StepSummary {...{ company: formData, handleInputChange }} />;
    };

    return (
        <div className="min-h-screen">
            {/* Language Switcher */}
            <div className="absolute right-8 top-6 z-10">
                <select
                    value={i18n.language}
                    onChange={e => i18n.changeLanguage(e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                </select>
            </div>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <button
                            onClick={() => navigate('/owner/dashboard')}
                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            {t('exit')}
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                {renderStep()}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white">
                <div className="max-w-4xl mx-auto flex justify-between px-4 py-4">
                    {currentStep > 1 && currentStep < 4 ? (
                        <button
                            onClick={prevStep}
                            className="text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg cursor-pointer"
                        >
                            {t('back')}
                        </button>
                    ) : <div />}
                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={(currentStep === 1 && !isStep1Valid && !isStep2Valid)}
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {t('next')}
                        </button>
                    ) : currentStep === 3 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isPublishDisabled}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? t('saving') : t('publish')}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CompanyCreationPage;
