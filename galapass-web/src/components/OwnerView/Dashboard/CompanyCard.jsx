import { MapPin, Image } from "lucide-react";
import React from "react";

const normalizeLocation = (location) => {
    if (!location) return 'No location';
    return (
        location
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase()) + ', Galápagos'
    );
};
import {useNavigate} from "react-router-dom";

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                {/* Logo Section */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                    {company.logo ? (
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <Image className="h-6 w-6 text-gray-400" />
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{normalizeLocation(company.location ) || "No location"}</span>
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>{company.tours?.length || 0} tours</span>
                        <span>{company.guides?.length || 0} guides</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
                        {company.status || "N/A"}
                    </span>
                    <button
                        onClick={() => navigate(`/owner/edit-company/${company.id}`)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CompanyCard;