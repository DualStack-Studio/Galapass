import { DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StepPricing = ({ formData, handleInputChange }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('set_your_price', 'Set your price')}</h2>
                <p className="text-lg text-gray-600">
                    {t('set_price_subtitle', "You can change this anytime. We'll help you price competitively.")}
                </p>
            </div>

            <div className="max-w-md mx-auto">
                <div className="text-center">
                    <div className="relative inline-block">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400" />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="pl-16 pr-8 py-6 text-4xl font-bold text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black w-full"
                            placeholder="0"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <p className="text-lg text-gray-600 mt-4">{t('per_person')}</p>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-4">{t('pricing_tips', 'Pricing tips')}</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• {t('pricing_tip_1', 'Research similar tours in your area')}</li>
                        <li>• {t('pricing_tip_2', 'Consider your unique value proposition')}</li>
                        <li>• {t('pricing_tip_3', 'Factor in all costs and desired profit')}</li>
                        <li>• {t('pricing_tip_4', 'Start competitive and adjust based on demand')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StepPricing;
