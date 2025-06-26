import { Star } from "lucide-react";
import React from "react";

const GuideCard = ({ guide }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    {guide.name || 'Unnamed Guide'}
                </h3>
                <p className="text-sm text-gray-600">
                    {guide.email || 'No email provided'}
                </p>
            </div>
            <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                    {guide.rating != null ? guide.rating : 'N/A'}
                </span>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active tours</span>
                <span className="text-sm font-medium text-gray-900">
                    {guide.activeTours != null ? guide.activeTours : '0'}
                </span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
            <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                Remove
            </button>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View Profile
            </button>
        </div>
    </div>
);

export default GuideCard;