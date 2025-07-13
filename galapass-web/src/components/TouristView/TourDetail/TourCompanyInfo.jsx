import {ArrowRight, CheckCircle2, Clock, Star, Users} from "lucide-react";
import React from "react";



const TourCompanyInfo = ({tour}) => {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-start">
                    <div><h2 className="text-2xl font-bold text-gray-800">Tour hosted by {tour.company.name}</h2></div>
                    <img src={tour.company.logo} alt={tour.company.name} className="w-16 h-16 rounded-full object-cover"/>
                </div>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-gray-200 py-4">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-teal-600"/>
                        <span className="text-gray-700">{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-teal-600"/>
                        <span className="text-gray-700">Up to {tour.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">{tour.category}</span>
                    </div>
                </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700"><p>{tour.description}</p></div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h3>
                <ul className="space-y-3">{tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="w-6 h-6 text-teal-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-lg">{highlight}</span>
                    </li>))}
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Meet Your Guide</h3>
                <div className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-xl">
                    <img src={tour.guides[0].profilePhoto} alt={tour.guides[0].name} className="w-20 h-20 rounded-full object-cover"/>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">{tour.guides[0].name}</h4>
                        <p className="text-gray-600 mt-1">{tour.guides[0].bio}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TourCompanyInfo;