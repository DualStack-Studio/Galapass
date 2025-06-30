import { Clock, Users, Building2 } from 'lucide-react';

const StepDetails = ({
                         formData,
                         setFormData,
                         handleInputChange,
                         handleHighlightChange,
                         handleGuideToggle,
                         handleTagToggle,
                         companies,
                         guides,
                         availableTags,
                     }) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about your tour</h2>
                <p className="text-lg text-gray-600">
                    Share the details that will help guests understand your experience.
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Description */}
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        Describe your tour
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="What makes your tour special? What will guests experience?"
                    />
                </div>

                {/* Highlights */}
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        Tour highlights
                    </label>
                    <div className="space-y-3">
                        {formData.highlights.map((highlight, index) => (
                            <input
                                key={index}
                                type="text"
                                value={highlight}
                                onChange={(e) => handleHighlightChange(index, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                placeholder={`Highlight ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Duration & Max Guests */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            Duration
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="e.g., 4 hours"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            Max guests
                        </label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="e.g., 8"
                            />
                        </div>
                    </div>
                </div>

                {/* Company Select */}
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        Company
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            name="companyId"
                            value={formData.companyId}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
                        >
                            <option value="">Select your company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Guides */}
                {guides.length > 0 && (
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-3">
                            Assign guides
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {guides.map((guide) => (
                                <label
                                    key={guide.id}
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedGuides.includes(guide.id)}
                                        onChange={() => handleGuideToggle(guide.id)}
                                        className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                                    />
                                    <span className="text-gray-900">{guide.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        Add tags to help guests find your tour
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
            </div>
        </div>
    );
};

export default StepDetails;
