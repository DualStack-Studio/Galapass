import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useCompanyForm } from '../../hooks/useCompanyForm';
import StepBasicInfo from '../../components/OwnerView/CompanyCreation/StepBasicInfo';
import StepBranding from '../../components/OwnerView/CompanyCreation/StepBranding';
import StepDetails from '../../components/OwnerView/CompanyCreation/StepDetails';
import useTourEnums from "../../hooks/useTourEnums.js";
import { useImageUpload } from "../../hooks/useImageUpload.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";

const CompanyCreationPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const ownerId = user?.id;
    const { formData, handleInputChange, handleSpecialtyToggle } = useCompanyForm();
    const [currentStep, setCurrentStep] = useState(1);
    const {
        uploadedImages,
        isUploading,
        handleImageUpload,
        removeImage
    } = useImageUpload();

    const uploadedLogo = uploadedImages[0] || null;

    const { locations } = useTourEnums();
    const [loading, setLoading] = useState(false);

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Company essentials' },
        { id: 2, title: 'Branding', description: 'Logo and identity' },
        { id: 3, title: 'Details', description: 'Complete your profile' }
    ];

    const isStep1Valid = formData.name && formData.location;
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
            logo: uploadedLogo?.url || null
        };

        try {
            const response = await fetch('http://localhost:8080/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create company');
            }

            const createdCompany = await response.json();
            console.log('Company created:', createdCompany);

            onSuccess?.(createdCompany);
            navigate('/owner/dashboard');
        } catch (error) {
            console.error('Error creating company:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload([file]);
        }
    };

    const renderStep = () => {
        if (currentStep === 1)
            return <StepBasicInfo {...{ formData, handleInputChange, handleSpecialtyToggle, locations }} />;
        if (currentStep === 2)
            return (
                <StepBranding
                    uploadedLogo={uploadedLogo}
                    handleFileSelect={handleFileSelect}
                    removeLogo={() => removeImage(uploadedLogo?.id)}
                    isUploading={isUploading}
                />
            );
        if (currentStep === 3)
            return <StepDetails {...{ formData, handleInputChange }} />;
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                {renderStep()}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white">
                <div className="max-w-4xl mx-auto flex justify-between px-4 py-4">
                    {currentStep > 1 ? (
                        <button onClick={prevStep} className="text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg">
                            Back
                        </button>
                    ) : <div />}

                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={(currentStep === 1 && !isStep1Valid)}
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isPublishDisabled}
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span>Creating...</span>
                            ) : (
                                <span className="flex items-center">
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Company
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyCreationPage;
