import { useTranslation } from 'react-i18next';

const StepPersonalMessage = ({ formData, setFormData }) => {
    const { t } = useTranslation();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            message: e.target.value,
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{t('guide_invitation.addPersonalMessage')}</h2>
                <p className="text-lg text-gray-600">
                    {t('guide_invitation.personalNoteWelcomeHint')}
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <label className="block text-lg font-medium mb-3">
                    {t('guide_invitation.personalMessageOptional')}
                </label>
                <textarea
                    value={formData.message || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('guide_invitation.personalMessagePlaceholder')}
                />
                <p className="text-sm text-gray-500 mt-2">
                    {t('guide_invitation.messageSentWithInvitation')}
                </p>
            </div>
        </div>
    );
};

export default StepPersonalMessage;