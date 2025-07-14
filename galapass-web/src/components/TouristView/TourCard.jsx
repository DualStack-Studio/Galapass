import React from 'react';
import {convertLocationName} from "../../api/tourApi.js";
import { useTranslation } from 'react-i18next';

const TourCard = ({ tour, onClick }) => {
    const { t, i18n } = useTranslation();
    const formatDuration = (duration) => {
        switch (duration) {
            case 'HALF_DAY': return i18n.language === 'es' ? 'Medio día' : 'Half Day';
            case 'FULL_DAY': return i18n.language === 'es' ? 'Día completo' : 'Full Day';
            case 'MULTI_DAY': return i18n.language === 'es' ? 'Varios días' : 'Multi Day';
            default: return duration;
        }
    };

    const coverImage = tour.media?.find(m => m.type === 'IMAGE').url;


    return (
        <div className="group cursor-pointer" onClick={onClick}>
            <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-0">
                <div className="relative overflow-hidden rounded-2xl">
                    <img
                        src={coverImage}
                        alt={tour.title}
                        className="w-full h-64 object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
                        >
                            <svg className="w-5 h-5 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                        <span className="bg-white bg-opacity-90 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                            {formatDuration(tour.duration)}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {tour.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {tour.rating ? tour.rating.toFixed(1) : 'N/A'}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {convertLocationName(tour.location)}
                    </div>

                    {/* Category and Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full capitalize">
                            {tour.category.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        {tour.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full capitalize">
                                {tag.replace(/_/g, ' ').toLowerCase()}
                            </span>
                        ))}
                        {tour.tags.length > 2 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                +{tour.tags.length - 2} more
                            </span>
                        )}
                    </div>

                    {/* Max Guests */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {t('max')} {tour.maxGuests} {t('guests')}
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {t('by')} {tour.company?.name || t('unknown')}
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">${tour.price}</span>
                            <span className="text-sm text-gray-500"> {t('per_person')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourCard;