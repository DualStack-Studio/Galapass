import React, {useState, useEffect, useRef} from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyForm } from '../../hooks/useCompanyForm';
import StepBasicInfo from '../../components/OwnerView/CompanyCreation/StepBasicInfo';
import StepBranding from '../../components/OwnerView/CompanyCreation/StepBranding';
import StepDetails from '../../components/OwnerView/CompanyCreation/StepDetails';
import useTourEnums from "../../hooks/useTourEnums.js";
import { useMediaUpload } from "../../hooks/useMediaUpload.js";
import StepSummary from "../../components/OwnerView/CompanyCreation/StepSummary.jsx";
import { useTranslation } from 'react-i18next';
import {BASE_URL} from "../../config.js";

const CompanyEditingPage = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const { formData, handleInputChange, handleSpecialtyToggle, setFormData } = useCompanyForm();
    const [currentStep, setCurrentStep] = useState(1);
    const [originalCompanyData, setOriginalCompanyData] = useState(null);
    const {
        media: uploadedImages,
        handleGeneralImageUploads,
        removeGeneralMedia,
        isUploading,
        isDeleting,
        setMedia: setUploadedImages
    } = useMediaUpload();

    const initialDataRef = useRef({ formData: null, uploadedImages: null });
    const uploadedLogo = uploadedImages[0] || null;


    const { locations } = useTourEnums();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const { t, i18n } = useTranslation();

    const steps = [
        { id: 1, title: t('basic_info'), description: t('company_essentials') },
        { id: 2, title: t('branding'), description: t('logo_and_identity') },
        { id: 3, title: t('details'), description: t('complete_profile') }
    ];


    // Fetch existing company data
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                setFetchLoading(true);
                const response = await fetch(`${BASE_URL}/api/companies/${companyId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch company data');
                }

                const companyArray = await response.json();
                const company = companyArray[0];


                setOriginalCompanyData(company);

                // Populate form with existing data
                setFormData({
                    name: company.name || '',
                    location: company.location || '',
                    status: company.status || 'ACTIVE',
                    description: company.description || '',
                    phone: company.phone || '',
                    email: company.email || ''
                });

                // Set existing logo if available
                if (company.logo) {
                    setUploadedImages([{
                        id: 'existing-logo',
                        url: company.logo,
                        file: null
                    }]);
                }

                initialDataRef.current = {
                    formData: {
                        name: company.name || '',
                        location: company.location || '',
                        status: company.status || 'ACTIVE',
                        description: company.description || '',
                        phone: company.phone || '',
                        email: company.email || ''
                    },
                    uploadedImages: company.logo
                        ? [{ id: 'existing-logo', url: company.logo, file: null }]
                        : []
                };
            } catch (error) {
                console.error('Error fetching company:', error);
                setError('Failed to load company data');
            } finally {
                setFetchLoading(false);
            }
        };
        if (companyId) {
            fetchCompanyData();
        }
    }, [companyId, setFormData, setUploadedImages]);

    const isStep1Valid = formData.name && formData.location;
    const isStep3Valid = formData.description && formData.phone && formData.email;

    const isUpdateDisabled = loading || !isStep1Valid || !isStep3Valid;

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);

        // Build payload with common fields
        const payload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            description: formData.description,
            location: formData.location,
            logo: uploadedLogo?.url || ''
        };

        // ✅ Include status if present (editing mode only)
        if (formData.status) {
            payload.status = formData.status;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/companies/${companyId}`, {
                method: 'PATCH', // ✅ Use PATCH instead of PUT
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
                throw new Error(errorMessage || 'Failed to update company');
            }

            const updatedCompany = await response.json();

            onSuccess?.(updatedCompany);

            setCurrentStep(4)
        } catch (error) {
            console.error('Error updating company:', error);
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

    const handleReset = () => {
        if (!initialDataRef.current.formData) return;

        setFormData(initialDataRef.current.formData);
        setUploadedImages(initialDataRef.current.uploadedImages);
        setError('');
    };

    useEffect(() => {
        if (!initialDataRef.current.formData) return;

        const isEqual =
            JSON.stringify(formData) === JSON.stringify(initialDataRef.current.formData) &&
            JSON.stringify(uploadedImages.map(img => img.url)) ===
            JSON.stringify(initialDataRef.current.uploadedImages.map(img => img.url));

        setUnsavedChanges(!isEqual);
    }, [formData, uploadedImages]);

    const renderStep = () => {
        if (currentStep === 1)
            return <StepBasicInfo {...{ formData, handleInputChange, handleSpecialtyToggle, locations, isEdit: true }} />;
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
            return <StepSummary {...{ company: formData, handleInputChange, isEdit: true}} />;
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('loading_company_data')}</p>
                </div>
            </div>
        );
    }

    if (error && !originalCompanyData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
                        {error}
                    </div>
                    <button
                        onClick={() => navigate('/owner/dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        {t('back_to_dashboard')}
                    </button>
                </div>
            </div>
        );
    }

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
                            {t('cancel')}
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
                        <div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {unsavedChanges && currentStep < 4 && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800 text-sm">{t('unsaved_changes')}</p>
                    </div>
                )}
                {renderStep()}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto flex justify-between px-4 py-4">
                    {currentStep > 1 && currentStep < 3 ? (
                        <button
                            onClick={prevStep}
                            className="text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg cursor-pointer"
                        >
                            {t('back')}
                        </button>
                    ) : <div />}
                    {unsavedChanges && currentStep < 4 && (
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 text-gray-600 hover:text-black hover:underline transition-colors cursor-pointer"
                        >
                            {t('reset_changes')}
                        </button>
                    )}
                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={(currentStep === 1 && !isStep1Valid)}
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {t('next')}
                        </button>
                    ) : currentStep === 3 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdateDisabled}
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <span>{t('updating')}</span>
                            ) : (
                                <span className="flex items-center cursor-pointer">
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('update_company')}
                                </span>
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

export default CompanyEditingPage;
