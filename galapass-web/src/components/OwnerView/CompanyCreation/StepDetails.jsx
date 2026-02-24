import { Globe, Phone, Mail, Users, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const StepDetails = ({ formData, handleInputChange }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{t("complete_company_profile")}</h2>
                <p className="text-lg text-gray-600">{t("add_company_details")}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block mb-2 font-medium">{t("description")}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border rounded-lg px-4 py-3"
                        placeholder={t("company_description_placeholder")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        icon={Phone}
                        label={t("phone_description")}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+593 5 123 4567"
                    />
                    <InputField
                        icon={Mail}
                        label={t("email_address")}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="info@company.com"
                    />
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon: Icon, label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block mb-2 font-medium">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded-lg pl-12 pr-4 py-3"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const SelectField = ({ icon: Icon, label, name, value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div>
            <label className="block mb-2 font-medium">{label}</label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full border rounded-lg pl-12 pr-4 py-3"
                >
                    <option value="">{t("select_team_size")}</option>
                    <option value="1-5">{t("team_size_1_5")}</option>
                    <option value="6-10">{t("team_size_6_10")}</option>
                    <option value="11-25">{t("team_size_11_25")}</option>
                    <option value="26-50">{t("team_size_26_50")}</option>
                    <option value="50+">{t("team_size_50_plus")}</option>
                </select>
            </div>
        </div>
    );
};

export default StepDetails;
