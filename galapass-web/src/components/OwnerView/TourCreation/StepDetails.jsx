import { Clock, Users, Building2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StepDetails = ({
                         formData,
                         handleInputChange,
                         handleHighlightChange,
                         handleTagToggle,
                         handleBringToggle,
                         companies,
                         availableTags,
                         availableBrings,
                         durations,
                     }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('stepDetails.tell_tour')}</h2>
                <p className="text-lg text-gray-600">{t('stepDetails.share_details')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        {t('stepDetails.describe')}
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder={t('stepDetails.describe_placeholder')}
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        {t('stepDetails.highlights')}
                    </label>
                    <div className="space-y-3">
                        {formData.highlights.map((highlight, index) => (
                            <input
                                key={index}
                                type="text"
                                value={highlight}
                                onChange={(e) => handleHighlightChange(index, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                placeholder={`${t('stepDetails.highlight')} ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            {t('stepDetails.duration')}
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer bg-white"
                            >
                                <option value="">{t('stepDetails.select_duration')}</option>
                                {durations.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            {t('stepDetails.max_guests')}
                        </label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                placeholder={t('stepDetails.guest_placeholder')}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        {t('stepDetails.company')}
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            name="companyId"
                            value={formData.companyId}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                        >
                            <option value="">{t('stepDetails.select_company')}</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        {t('stepDetails.tags')}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {availableTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleTagToggle(tag.id)}
                                className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                                    formData.tags.includes(tag.id)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                                }`}
                            >
                                <span className="mr-2">{tag.icon}</span>
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        <Package className="inline-block h-5 w-5 mr-2 -mt-1" />
                        {t('stepDetails.bring')}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {availableBrings.map((bring) => (
                            <button
                                key={bring.id}
                                type="button"
                                onClick={() => handleBringToggle(bring.id)}
                                className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                                    formData.brings.includes(bring.id)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                                }`}
                            >
                                <span className="mr-2">{bring.icon}</span>
                                {bring.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepDetails;