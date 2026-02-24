import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchGuidesByName } from '../../../api/guideApi';
import { useTranslation } from 'react-i18next';

const StepGuideInfo = ({ formData, setFormData, selectedGuide, setSelectedGuide }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState(formData.name || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length >= 2 && !selectedGuide) {
                fetchGuides(query);
            } else {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [query, selectedGuide]);

    const fetchGuides = async (searchQuery) => {
        try {
            setLoading(true);
            setError('');
            const guides = await searchGuidesByName(searchQuery);
            setResults(guides);
        } catch (err) {
            console.error(err);
            setError('Error fetching guides');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (guide) => {
        setSelectedGuide(guide);
        setFormData({
            ...formData,
            name: guide.name,
            email: guide.email,
            guideId: guide.id,
        });
        setResults([]);
        setQuery(guide.name);
    };

    const handleClear = () => {
        setSelectedGuide(null);
        setFormData({
            ...formData,
            name: '',
            email: '',
            guideId: '',
        });
        setQuery('');
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{t('guide_invitation.searchGuideByName')}</h2>
                <p className="text-lg text-gray-600">{t('guide_invitation.selectExistingGuide')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-3">{t('guide_invitation.guidesFullName')}</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={!!selectedGuide}
                            className={`w-full pl-12 pr-12 py-4 text-lg border ${
                                selectedGuide ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                            } border-gray-300 rounded-lg`}
                            placeholder="E.g. Carlos Rodriguez"
                        />
                        {selectedGuide && (
                            <button
                                onClick={handleClear}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}

                        {!selectedGuide && results.length > 0 && (
                            <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {results.map((guide) => (
                                    <li
                                        key={guide.id}
                                        onClick={() => handleSelect(guide)}
                                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <div className="font-medium text-gray-900">{guide.name}</div>
                                        <div className="text-sm text-gray-600">{guide.email}</div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {loading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                {t('guide_invitation.searching')}
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>

                {selectedGuide && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        ✅ {t('guide_invitation.selected')} <strong>{selectedGuide.name}</strong> ({selectedGuide.email})
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepGuideInfo;
