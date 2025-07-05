import { Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StepSummary = ({ company, isEdit = false }) => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/owner/dashboard');
    };

    return (
        <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold mb-4">
                {isEdit ? 'Company Edited!' : 'Company Created!'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                <strong>{company.name}</strong> has been successfully {isEdit ? 'updated' : 'created'} and {isEdit ? 'saved' : 'added'} to your business.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">Company Profile Ready</span>
                </div>
                <div className="text-sm text-blue-700">
                    <p><strong>Location:</strong> {company.location}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Phone:</strong> {company.phone}</p>
                </div>
            </div>

            <button
                onClick={handleBackToDashboard}
                className="mt-6 inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </button>
        </div>
    );
};

export default StepSummary;
