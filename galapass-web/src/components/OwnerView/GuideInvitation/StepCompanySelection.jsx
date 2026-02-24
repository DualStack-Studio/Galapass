import { Building2 } from 'lucide-react';
import {useTranslation} from "react-i18next";

const StepCompanySelection = ({ companies, formData, setFormData }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{t('guide_invitation.assignToCompany')}</h2>
                <p className="text-lg text-gray-600">{t('guide_invitation.selectCompanyForGuide')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {companies.map(company => (
                    <button
                        key={company.id}
                        onClick={() => setFormData(prev => ({ ...prev, companyId: company.id }))}
                        className={`w-full p-6 rounded-xl border-2 ${
                            formData.companyId === company.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                <Building2 className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{company.name}</h3>
                                <p className="text-sm text-gray-500">{t('guide_invitation.tourCompany')}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StepCompanySelection;
