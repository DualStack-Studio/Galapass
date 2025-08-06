import {ArrowRight, CheckCircle2, Clock, Star, Users, User} from "lucide-react";
import React from "react";
import { useTranslation } from 'react-i18next';

const TourCompanyInfo = ({tour, selectedDate, upcomingDates}) => {
    // Get the selected tour date object to access guides
    const selectedTourDate = upcomingDates?.find(d => d.date === selectedDate);
    const guides = selectedTourDate?.guides || [];
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-start">
                    <div><h2 className="text-2xl font-bold text-gray-800">{t('tour_details.tour_hosted_by', {companyName: tour.company.name})}</h2></div>
                    <img src={tour.company.logo} alt={tour.company.name} className="w-16 h-16 rounded-full object-cover"/>
                </div>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-gray-200 py-4">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-emerald-600"/>
                        <span className="text-gray-700">{t(`durations.${tour.duration}`)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-emerald-600"/>
                        <span className="text-gray-700">{t('tour_details.max_guests_info', {max: tour.maxGuests})}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">{t(`categories.${tour.category}`)}</span>
                    </div>
                </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700"><p>{tour.description}</p></div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('tour_details.whats_included')}</h3>
                <ul className="space-y-3">{tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-lg">{highlight}</span>
                    </li>))}
                </ul>
            </div>

            {/* Dynamic Guide Section */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedDate ? t('tour_details.your_tour_guides') : t('tour_details.meet_your_guide')}
                </h3>

                {selectedDate ? (
                    // Show guides for selected date
                    guides.length > 0 ? (
                        <div className="space-y-4">
                            {guides.map((guide) => (
                                <div key={guide.id} className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-xl">
                                    {guide.profilePhoto ? (
                                        <img
                                            src={guide.profilePhoto}
                                            alt={guide.name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-emerald-600" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-gray-900">{guide.name}</h4>
                                        {guide.email && (
                                            <p className="text-gray-500 text-sm mt-1">{guide.email}</p>
                                        )}
                                        {guide.bio && (
                                            <p className="text-gray-600 mt-2">{guide.bio}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-start space-x-4 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-medium text-gray-500">{t('tour_details.guide_assignment_pending')}</h4>
                                <p className="text-gray-500 mt-1">
                                    {t('tour_details.guide_assignment_pending_desc')}
                                </p>
                            </div>
                        </div>
                    )
                ) : (
                    // Show default message when no date is selected
                    <div className="flex items-start space-x-4 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-medium text-blue-900">{t('tour_details.select_date_see_guide')}</h4>
                            <p className="text-blue-700 mt-1">
                                {t('tour_details.select_date_see_guide_desc')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default TourCompanyInfo;