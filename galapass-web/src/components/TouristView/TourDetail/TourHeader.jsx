import React from 'react';
import { Star, MapPin, Heart, Share2 } from 'lucide-react';
import {convertLocationName} from "../../../api/tourApi.js";

const TourHeader = ({ tour, isLiked, onLikeToggle }) => (
    <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">{tour.title}</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-800">{tour.averageRating || 0.0}</span>
                    <span className="underline cursor-pointer">({tour.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{convertLocationName(tour.location)}</span>
                </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <button onClick={onLikeToggle} className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Saved' : 'Save'}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    </div>
);

export default TourHeader;