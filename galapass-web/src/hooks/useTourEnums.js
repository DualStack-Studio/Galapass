import { useEffect, useState } from 'react';

// Meta-information for styling and icons
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

const bringMeta = {
    SUN_PROTECTION: { icon: '🧴' },
    LIGHT_JACKET: { icon: '🧥' },
    CAMERA: { icon: '📷' },
    REUSABLE_WATER_BOTTLE: { icon: '💧' },
    COMFORTABLE_SHOES: { icon: '👟' },
    SWIMSUIT: { icon: '🩱' },
    BACKPACK: { icon: '🎒' },
    SUNGLASSES: { icon: '😎' },
    SEASICKNESS_MEDICATION: { icon: '💊' },
    CASH: { icon: '💵' },
    WATER_SHOES: { icon: '🩴' },
    BINOCULARS: { icon: '🔭' },
};


const useTourEnums = () => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [locations, setLocations] = useState([]);
    const [brings, setBrings] = useState([]);
    const [durations, setDurations] = useState([]);
    const [enumLoading, setEnumLoading] = useState(true);
    const [enumError, setEnumError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all enums in parallel
                const [resCat, resTags, resLoc, resBrings, resDurs] = await Promise.all([
                    fetch('http://localhost:8080/api/enums/categories', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/tags', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/locations', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/brings', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/enums/durations', { credentials: 'include' }),
                ]);

                // Parse all JSON responses
                const [categoriesRaw, tagsRaw, locationsRaw, bringsRaw, durationsRaw] = await Promise.all([
                    resCat.json(),
                    resTags.json(),
                    resLoc.json(),
                    resBrings.json(),
                    resDurs.json(),
                ]);

                // Process and set categories
                setCategories(categoriesRaw.map(cat => ({
                    id: cat.key,
                    name: cat.displayName,
                    icon: categoryMeta[cat.key]?.icon || '🗺️',
                    color: categoryMeta[cat.key]?.color || 'bg-gray-100 text-gray-800'
                })));

                // Process and set tags
                setTags(tagsRaw.map(tag => ({
                    id: tag.key,
                    name: tag.displayName,
                    icon: tagMeta[tag.key]?.icon || '🏷️'
                })));

                // Process and set locations
                setLocations(locationsRaw.map(loc => ({
                    id: loc.key,
                    name: loc.displayName
                })));

                // Process and set things to bring
                setBrings(bringsRaw.map(bring => ({
                    id: bring.key,
                    name: bring.displayName,
                    icon: bringMeta[bring.key]?.icon || '✅'
                })));

                setDurations(durationsRaw.map(duration => ({
                    id: duration.key,
                    name: duration.displayName,
                })));

            } catch (e) {
                setEnumError('Failed to fetch tour data');
                console.error(e);
            } finally {
                setEnumLoading(false);
            }
        };

        fetchData();
    }, []);

    // Return all the data, including the new "brings" array
    return { categories, tags, locations, brings, durations, enumLoading, enumError };
};

export default useTourEnums;