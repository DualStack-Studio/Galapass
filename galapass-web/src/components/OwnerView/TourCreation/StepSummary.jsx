import { CheckCircle, ArrowLeft, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {convertLocationName} from "../../../api/tourApi.js";

const TourStepSummary = ({ tour, isEdit = false }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleBackToDashboard = () => {
        navigate('/owner/dashboard');
    };

    return (
        <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
                {isEdit ? t('tour_edited', 'Tour Edited!') : t('tour_created', 'Tour Created!')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                <strong>{tour.title}</strong> {isEdit
                    ? t('tour_updated_and_saved', 'has been successfully updated and saved to your company.')
                    : t('tour_published_and_added', 'has been successfully published and added to your company.')}
            </p>

            <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-8 text-left text-blue-800">
                <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">{convertLocationName(tour.location)}</span>
                </div>
                <div className="text-sm space-y-1">
                    <p><Clock className="inline w-4 h-4 mr-1" /> <strong>{t('duration', 'Duration')}:</strong> {t(`durations.${tour.duration}`)}</p>
                    <p><Users className="inline w-4 h-4 mr-1" /> <strong>{t('stepDetails.max_guests')}:</strong> {tour.maxGuests}</p>
                    <p><DollarSign className="inline w-4 h-4 mr-1" /> <strong>{t('price', 'Price')}:</strong> ${tour.price}</p>
                </div>
            </div>

            <button
                onClick={handleBackToDashboard}
                className="mt-6 inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('back_to_dashboard', 'Back to Dashboard')}
            </button>
        </div>
    );
};

export default TourStepSummary;