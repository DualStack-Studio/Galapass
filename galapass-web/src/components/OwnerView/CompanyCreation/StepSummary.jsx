import { Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StepSummary = ({ company, isEdit = false }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleBackToDashboard = () => {
        navigate('/owner/dashboard');
    };

    return (
        <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold mb-4">
                {isEdit ? t('company_edited') : t('company_created')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                <strong>{company.name}</strong> {isEdit ? t('company_updated_success') : t('company_created_success')}
            </p>

            <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">{t('company_profile_ready')}</span>
                </div>
                <div className="text-sm text-blue-700">
                    <p><strong>{t('location')}:</strong> {company.location}</p>
                    <p><strong>{t('email_address')}:</strong> {company.email}</p>
                    <p><strong>{t('phone_description')}:</strong> {company.phone}</p>
                </div>
            </div>

            <button
                onClick={handleBackToDashboard}
                className="mt-6 inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('back_to_dashboard')}
            </button>
        </div>
    );
};

export default StepSummary;
