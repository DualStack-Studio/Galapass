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

const GuideCompanyCard = ({ company }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
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

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{normalizeLocation(company.location)}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{company.tours?.length || 0} tours</span>
                    <span>{company.guides?.length || 0} guides</span>
                </div>
            </div>
        </div>
    </div>
);

export default GuideCompanyCard;
