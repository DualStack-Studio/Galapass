const StepPersonalMessage = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            message: e.target.value,
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">Add a Personal Message</h2>
                <p className="text-lg text-gray-600">
                    Make the invitation more welcoming with a personal note (optional)
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <label className="block text-lg font-medium mb-3">
                    Personal message (optional)
                </label>
                <textarea
                    value={formData.message || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="E.g., Hey Pablo! We'd love to have you join our company. Let me know if you have questions."
                />
                <p className="text-sm text-gray-500 mt-2">
                    This message will be sent along with the invitation.
                </p>
            </div>
        </div>
    );
};

export default StepPersonalMessage;