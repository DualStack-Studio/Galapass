import React from 'react';

const TourCard = ({ tour }) => {
    return (
        <div className="group cursor-pointer">
            <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="relative overflow-hidden">
                    <img
                        src={(tour.photoUrls && tour.photoUrls[0]) || '/images/galapassLogo.png'}
                        alt={tour.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                        <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
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
                            {tour.rating != null ? tour.rating.toFixed(1) : 'N/A'}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>

                    {/* Category */}
                    <div className="flex mb-3">
                        {tour.category && (
                            <span className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                {tour.category.replace('_', ' ')} {/* Optional: Make it prettier */}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            By {tour.company?.name || 'Unknown'}
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">${tour.price}</span>
                            <span className="text-sm text-gray-500"> per person</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourCard;