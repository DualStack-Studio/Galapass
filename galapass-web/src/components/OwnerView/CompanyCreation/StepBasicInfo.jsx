import { Building2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StepBasicInfo = ({ formData, handleInputChange, locations, isEdit = false }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{t("company_essentials")}</h2>
                <p className="text-lg text-gray-600">{t("basic_info")}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Company Name */}
                <div>
                    <label className="block text-lg font-medium mb-3">
                        {t("company_name") || "Company Name"}
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 border rounded-lg"
                            placeholder={t("company_name_placeholder") || "E.g., Galápagos Adventures"}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        {t("location_question") || "Where is your tour located?"}
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                        >
                            <option value="">{t("select_location") || "Select a location"}</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Status (only in edit mode) */}
                {isEdit && (
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            {t("company_status") || "Company Status"}
                        </label>
                        <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="">{t("select_status") || "Select status"}</option>
                            <option value="ACTIVE">{t("active") || "Active"}</option>
                            <option value="INACTIVE">{t("inactive") || "Inactive"}</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepBasicInfo;
