import { Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StepSummary = ({ guide, company }) => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/owner/dashboard');
    };

    return (
        <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Guide Invited!</h2>
            <p className="text-lg text-gray-600 mb-8">
                {guide.name} has been successfully invited to <strong>{company.name}</strong>.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">Team Updated</span>
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
