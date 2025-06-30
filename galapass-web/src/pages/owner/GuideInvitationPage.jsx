import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import StepGuideInfo from '../../components/OwnerView/GuideInvitation/StepGuideInfo';
import StepCompanySelection from '../../components/OwnerView/GuideInvitation/StepCompanySelection';
import StepSummary from '../../components/OwnerView/GuideInvitation/StepSummary';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import {useTourCreation} from "../../hooks/UseTourCreation.js";
import StepPersonalMessage from "../../components/OwnerView/GuideInvitation/StepPersonalMessage.jsx";
import {sendGuideInvitation} from "../../api/guideApi.js";
import {useNavigate} from "react-router-dom";

const AddGuidePage = () => {
    const { user } = useAuth();
    const ownerId = user?.id;
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', companyId: '' });
    const [foundGuides, setFoundGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [guideAdded, setGuideAdded] = useState(false);
    const { companies, loading: companiesLoading, error: companiesError } = useTourCreation(ownerId);


    const handleSubmit = async () => {
        try {
            const payload = {
                guideId: selectedGuide.id,
                companyId: parseInt(formData.companyId),
                message: formData.message || '',
            };
            console.log('Sending invitation:', payload);

            const response = await sendGuideInvitation(payload);

            console.log('Invitation created:', response);
            toast.success('Guide added successfully!');
            setGuideAdded(true);
            setCurrentStep(4);
        } catch (error) {
            toast.error(error.message || 'Failed to add guide');
            console.error(error);
        }
    };


    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <button onClick={() => navigate('/owner/dashboard')} className="flex items-center text-gray-600 cursor-pointer">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Exit
                        </button>
                        <div className="w-16" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {currentStep === 1 && (
                    <StepGuideInfo
                        formData={formData}
                        setFormData={setFormData}
                        selectedGuide={selectedGuide}
                        setSelectedGuide={setSelectedGuide}
                    />
                )}
                {currentStep === 2 && (
                    <StepCompanySelection
                        companies={companies}
                        formData={formData}
                        setFormData={setFormData}
                        foundGuides={foundGuides}
                        selectedGuide={selectedGuide}
                        setSelectedGuide={setSelectedGuide}
                    />
                )}
                {currentStep === 3 && (
                    <StepPersonalMessage
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
                {currentStep === 4 && (
                    <StepSummary
                        guide={selectedGuide}
                        company={companies.find(c => c.id === parseInt(formData.companyId))}
                    />
                )}
            </div>

            {/* Footer */}
            {!guideAdded && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between">
                        {currentStep > 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                            >
                                Back
                            </button>
                        ) : <div />}

                        {currentStep === 1 && (
                            <button
                                onClick={() => setCurrentStep(2)}
                                disabled={!selectedGuide}
                                className={`px-8 py-3 ${
                                    selectedGuide ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
                                } text-white rounded-lg`}
                            >
                                Next
                            </button>
                        )}

                        {currentStep === 2 && (
                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={!formData.companyId}
                                className={`px-8 py-3 ${
                                    formData.companyId ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
                                } text-white rounded-lg`}
                            >
                                Next
                            </button>
                        )}

                        {currentStep === 3 && (
                            <button
                                onClick={() => handleSubmit()}
                                className="px-8 py-3 bg-black text-white rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                                <Send className="h-4 w-4" />
                                <span>Invite Guide</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddGuidePage;
