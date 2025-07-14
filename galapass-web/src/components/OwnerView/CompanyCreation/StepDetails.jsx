import { Globe, Phone, Mail, Users, FileText } from "lucide-react";

const StepDetails = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">Complete your company profile</h2>
                <p className="text-lg text-gray-600">Add details about your company</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border rounded-lg px-4 py-3"
                        placeholder="Tell us about your company..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+593 5 123 4567"/>
                    <InputField icon={Mail} label="Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="info@company.com"/>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon: Icon, label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block mb-2 font-medium">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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

const SelectField = ({ icon: Icon, label, name, value, onChange }) => (
    <div>
        <label className="block mb-2 font-medium">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded-lg pl-12 pr-4 py-3"
            >
                <option value="">Select team size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-10">6-10 people</option>
                <option value="11-25">11-25 people</option>
                <option value="26-50">26-50 people</option>
                <option value="50+">50+ people</option>
            </select>
        </div>
    </div>
);

export default StepDetails;