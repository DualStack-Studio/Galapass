import { useEffect, useState } from 'react';

const categoryMeta = {
    WILDLIFE: { icon: '🦎', color: 'bg-green-100 text-green-800' },
    SNORKELING: { icon: '🤿', color: 'bg-blue-100 text-blue-800' },
    HIKING: { icon: '🥾', color: 'bg-orange-100 text-orange-800' },
    BOAT_TOUR: { icon: '⛵', color: 'bg-cyan-100 text-cyan-800' },
    DIVING: { icon: '🦈', color: 'bg-teal-100 text-teal-800' },
    KAYAKING: { icon: '🛶', color: 'bg-sky-100 text-sky-800' },
    PHOTOGRAPHY: { icon: '📸', color: 'bg-purple-100 text-purple-800' },
    CULTURAL: { icon: '🏛️', color: 'bg-yellow-100 text-yellow-800' },
    SCIENCE_EDUCATION: { icon: '🔬', color: 'bg-indigo-100 text-indigo-800' },
    ADVENTURE: { icon: '🏔️', color: 'bg-red-100 text-red-800' },
};

const tagMeta = {
    FAMILY_FRIENDLY: { icon: '👨‍👩‍👧‍👦' },
    LUXURY: { icon: '✨' },
    BUDGET: { icon: '💰' },
    FULL_DAY: { icon: '🌅' },
    HALF_DAY: { icon: '⏰' },
    MULTI_DAY: { icon: '🗓️' },
    PRIVATE: { icon: '🔒' },
    GROUP: { icon: '👥' },
    ACCESSIBLE: { icon: '♿' },
    ECO_FRIENDLY: { icon: '🌿' },
    ISLAND_HOPPING: { icon: '🏝️' },
    BEACH: { icon: '🏖️' },
    SUNSET: { icon: '🌇' },
    WILDLIFE_FOCUS: { icon: '🦜' },
    MARINE_FOCUS: { icon: '🐠' },
    LAND_FOCUS: { icon: '🌋' },
    BEGINNER_FRIENDLY: { icon: '🧍' },
    ADVANCED: { icon: '💪' },
    PHOTOGRAPHY_OPPORTUNITY: { icon: '📷' },
};

const useTourEnums = () => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [locations, setLocations] = useState([]);
    const [enumLoading, setEnumLoading] = useState(true);
    const [enumError, setEnumError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCat, resTags, resLoc] = await Promise.all([
                    fetch('http://localhost:8080/api/enums/categories', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/tags', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/locations', { credentials: 'include' }),
                ]);

                const [categoriesRaw, tagsRaw, locationsRaw] = await Promise.all([
                    resCat.json(),
                    resTags.json(),
                    resLoc.json(),
                ]);

                setCategories(categoriesRaw.map(cat => ({
                    id: cat,
                    name: cat.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()),
                    icon: categoryMeta[cat]?.icon || '🗺️',
                    color: categoryMeta[cat]?.color || 'bg-blue-100 text-blue-800'
                })));

                setTags(tagsRaw.map(tag => ({
                    id: tag,
                    name: tag.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()),
                    icon: tagMeta[tag]?.icon || '🏷️'
                })));

                setLocations(locationsRaw.map(loc => ({
                    id: loc,
                    name: loc
                        .replace(/_/g, ' ')      // Replace underscores with spaces
                        .toLowerCase()           // Make lowercase
                        .replace(/(^|\s)\S/g, l => l.toUpperCase()) + ', Galápagos' // Capitalize and append ', Galápagos'
                })));
            } catch (e) {
                setEnumError('Failed to fetch categories/tags/locations');
            } finally {
                setEnumLoading(false);
            }
        };

        fetchData();
    }, []);

    return { categories, tags, locations, enumLoading, enumError };
};

export default useTourEnums;
