import {Eye, MapPin, Settings} from "lucide-react";
import React from "react";

const CompanyCard = ({ company }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{company.location}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{company.toursCount} tours</span>
                    <span>{company.guidesCount} guides</span>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                </button>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
            {company.status}
          </span>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Manage
                </button>
            </div>
        </div>
    </div>
);

export default CompanyCard;