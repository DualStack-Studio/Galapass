import {Star} from "lucide-react";
import React from "react";

const TourCard = ({ tour }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{tour.title}</h3>
            <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{tour.rating}</span>
            </div>
        </div>
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price per person</span>
                <span className="text-lg font-semibold text-emerald-600">${tour.price}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total bookings</span>
                <span className="text-sm font-medium text-gray-900">{tour.bookings}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
          {tour.status}
        </span>
            <div className="flex space-x-2">
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Edit
                </button>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Bookings
                </button>
            </div>
        </div>
    </div>
);

export default TourCard;