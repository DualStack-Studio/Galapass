import {Star, ArrowRight} from "lucide-react";
import { useTranslation } from 'react-i18next';


const Reviews = ({tour, formatDate}) => {
  const { t } = useTranslation();

  return (
    <div>
        <div className="flex items-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <h3 className="text-2xl font-bold text-gray-800">{t('tour_details.reviews', {rating: tour.averageRating, count: tour.reviewCount})}</h3>
        </div>
        <div className="space-y-6">{tour.reviews.map((review) => (
            <div key={review.id}>
                <div className="flex items-center space-x-4">
                    <img src={review.reviewer.profilePictureUrl} alt={review.reviewer.name} className="w-12 h-12 rounded-full object-cover"/>
                        <div>
                            <h4 className="font-bold text-gray-900">{review.reviewer.name}</h4>
                            <span className="text-gray-500 text-sm">{formatDate(review.date, { month: 'long', year: 'numeric' }) || "2018"}</span>
                        </div>
                </div>
                <div className="flex items-center space-x-1 my-2">{[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
            </div>))}
        </div>
        <button className="mt-8 w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-bold transition-colors">
            <span>{t('tour_details.show_all_reviews', {count: tour.totalReviews})}</span>
            <ArrowRight className="w-4 h-4"/>
        </button>
    </div>
  )
};

export default Reviews;