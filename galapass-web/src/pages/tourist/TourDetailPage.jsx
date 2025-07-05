import React, { useState, useEffect } from 'react';
import {
    Star,
    MapPin,
    Clock,
    Users,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    Check,
    X,
    Camera,
    User
} from 'lucide-react';

const TourDetailPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Mock data - replace with API calls
    const tour = {
        id: 1,
        title: "Galápagos Wildlife Discovery Tour",
        description: "Embark on an unforgettable journey through the enchanting Galápagos Islands. This comprehensive tour takes you to the most spectacular wildlife viewing spots, where you'll encounter giant tortoises, marine iguanas, blue-footed boobies, and sea lions in their natural habitat. Our expert naturalist guides will share fascinating insights about the unique ecosystem that inspired Charles Darwin's theory of evolution.",
        price: 299.99,
        location: "Santa Cruz Island, Galápagos",
        duration: "8 hours",
        maxGuests: 12,
        rating: 4.8,
        reviewCount: 47,
        category: "WILDLIFE",
        photoUrls: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop"
        ],
        highlights: [
            "See giant tortoises in their natural habitat",
            "Snorkel with sea lions and tropical fish",
            "Spot blue-footed boobies and frigatebirds",
            "Visit Charles Darwin Research Station",
            "Professional naturalist guide included"
        ],
        tags: ["WILDLIFE", "SNORKELING", "EDUCATIONAL"],
        company: {
            name: "Galápagos Adventures",
            logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop&auto=format"
        },
        guides: [
            {
                id: 1,
                name: "Carlos Rodriguez",
                profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&auto=format",
                bio: "Certified naturalist guide with 15 years of experience in the Galápagos Islands."
            }
        ]
    };

    const reviews = [
        {
            id: 1,
            reviewer: {
                name: "Sarah Johnson",
                profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b31b8c71?w=50&h=50&fit=crop&auto=format"
            },
            rating: 5,
            comment: "Absolutely incredible experience! Carlos was an amazing guide who knew so much about the wildlife. We saw giant tortoises, marine iguanas, and even got to swim with sea lions. The snorkeling was fantastic and the equipment was top quality. Highly recommend!",
            createdAt: "2024-06-15"
        },
        {
            id: 2,
            reviewer: {
                name: "Michael Chen",
                profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&auto=format"
            },
            rating: 5,
            comment: "This tour exceeded all expectations. The wildlife viewing was spectacular and our guide's knowledge was impressive. Great value for money and very well organized.",
            createdAt: "2024-06-10"
        },
        {
            id: 3,
            reviewer: {
                name: "Emily Rodriguez",
                profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&auto=format"
            },
            rating: 4,
            comment: "Wonderful tour with amazing wildlife sightings. The only minor issue was that we spent a bit too much time at one location, but overall it was fantastic.",
            createdAt: "2024-06-05"
        }
    ];

    // Mock available dates - replace with API call
    const availableDates = [
        { date: '2024-07-15', available: true, price: 299.99 },
        { date: '2024-07-16', available: true, price: 299.99 },
        { date: '2024-07-17', available: false, price: 299.99 },
        { date: '2024-07-18', available: true, price: 299.99 },
        { date: '2024-07-19', available: true, price: 299.99 },
        { date: '2024-07-20', available: true, price: 329.99 },
        { date: '2024-07-21', available: true, price: 329.99 },
    ];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % tour.photoUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + tour.photoUrls.length) % tour.photoUrls.length);
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{tour.rating}</span>
                                <span>({tour.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{tour.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                                isLiked
                                    ? 'bg-red-50 border-red-200 text-red-600'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span>Save</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-96 md:h-80">
                        {/* Main Image */}
                        <div className="relative col-span-1 md:col-span-1">
                            <img
                                src={tour.photoUrls[currentImageIndex]}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-2 gap-2 h-full">
                                {tour.photoUrls.slice(1, 5).map((url, index) => (
                                    <div
                                        key={index}
                                        className={`relative cursor-pointer overflow-hidden ${
                                            index === 2 ? 'rounded-tr-xl' : ''
                                        } ${index === 3 ? 'rounded-br-xl' : ''}`}
                                        onClick={() => setCurrentImageIndex(index + 1)}
                                    >
                                        <img
                                            src={url}
                                            alt={`${tour.title} ${index + 2}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {index === 3 && tour.photoUrls.length > 5 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Camera className="w-6 h-6 mx-auto mb-1" />
                                                    <span className="text-sm font-medium">+{tour.photoUrls.length - 5} more</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tour Details */}
                    <div>
                        <div className="flex items-center space-x-6 mb-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">{tour.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">Up to {tour.maxGuests} guests</span>
                            </div>
                            <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  {tour.category}
                </span>
                            </div>
                        </div>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h3>
                        <div className="space-y-3">
                            {tour.highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guide Information */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Meet Your Guide</h3>
                        <div className="space-y-4">
                            {tour.guides.map((guide) => (
                                <div key={guide.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={guide.profilePhoto}
                                        alt={guide.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{guide.name}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{guide.bio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Reviews ({tour.reviewCount})
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-medium">{tour.rating}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {reviewsToShow.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={review.reviewer.profilePhoto}
                                            alt={review.reviewer.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                                                <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {reviews.length > 3 && (
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="mt-6 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                {showAllReviews ? 'Show less' : `Show all ${reviews.length} reviews`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">${tour.price}</span>
                                    <span className="text-gray-600 ml-1">per person</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{tour.rating}</span>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                    {availableDates.map((dateOption) => (
                                        <button
                                            key={dateOption.date}
                                            onClick={() => dateOption.available && setSelectedDate(dateOption.date)}
                                            disabled={!dateOption.available}
                                            className={`p-3 rounded-lg border text-left transition-colors ${
                                                selectedDate === dateOption.date
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : dateOption.available
                                                        ? 'border-gray-300 hover:border-gray-400'
                                                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                        <span className={`font-medium ${
                            !dateOption.available ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                          {formatDate(dateOption.date)}
                        </span>
                                                {dateOption.available ? (
                                                    <span className="text-sm text-gray-600">${dateOption.price}</span>
                                                ) : (
                                                    <span className="text-sm text-red-500">Full</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Guests
                                </label>
                                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                                    <span className="text-gray-700">Guests</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="font-medium">{guests}</span>
                                        <button
                                            onClick={() => setGuests(Math.min(tour.maxGuests, guests + 1))}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">${tour.price} x {guests} guests</span>
                                    <span className="text-gray-900">${(tour.price * guests).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-gray-900">${(tour.price * guests).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                disabled={!selectedDate}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                    selectedDate
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {selectedDate ? 'Book Now' : 'Select Date'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                You won't be charged yet
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailPage;