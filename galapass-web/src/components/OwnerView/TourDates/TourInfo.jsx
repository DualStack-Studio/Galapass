import { DollarSign, Users, MapPin, Clock } from 'lucide-react';

const TourInfo = (tour) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Information</h3>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{tour.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Base price: ${tour.price}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Max guests: {tour.maxGuests}</span>
                </div>
            </div>
        </div>
    );
};

export default TourInfo;