import { X } from 'lucide-react';
import useTourEnums from "../../hooks/useTourEnums.js";
import {useEffect, useState} from "react";

const FiltersModal = ({ isOpen, onClose, filters, onFilterToggle, onClear }) => {
    const { categories, tags, durations } = useTourEnums();
    const [isVisible, setIsVisible] = useState(isOpen);

    // This effect handles the delay for the fade-out animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Wait for the animation to finish before unmounting
            const timer = setTimeout(() => setIsVisible(false), 200); // Must match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Don't render the component if it's not supposed to be visible
    if (!isVisible) {
        return null;
    }

    const FilterButtonGroup = ({ title, options, filterType }) => (
        // ... (this part of your code is fine and remains unchanged)
        <div>
            <h3 className="font-semibold mb-4 text-gray-800 text-lg">{title}</h3>
            <div className="flex flex-wrap gap-3">
                {options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => onFilterToggle(filterType, option.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-105 cursor-pointer ${
                            filters[filterType].includes(option.id)
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-md'
                                : 'bg-white text-gray-700 hover:border-gray-400 border-gray-300'
                        }`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
    );


    return (
        <div
            // Conditionally apply fade-in or fade-out animation
            className={`fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 ${
                isOpen ? 'animate-fade-in' : 'animate-fade-out'
            }`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">More Filters</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer">
                            <X size={24}/>
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-6 space-y-8 overflow-y-auto">
                    <FilterButtonGroup title="Category" options={categories} filterType="categories" />
                    <FilterButtonGroup title="Tags" options={tags} filterType="tags" />
                    <FilterButtonGroup title="Duration" options={durations} filterType="durations" />
                </div>
                <div className="flex-shrink-0 flex justify-between items-center border-t border-gray-200 p-6 pt-5">
                    <button onClick={onClear} className="font-bold text-gray-700 hover:underline cursor-pointer px-4 py-2">
                        Clear all
                    </button>
                    <button onClick={onClose} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer">
                        Show tours
                    </button>
                </div>
            </div>
            {/* Add the fade-out keyframes and class */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-out { animation: fade-out 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default FiltersModal;