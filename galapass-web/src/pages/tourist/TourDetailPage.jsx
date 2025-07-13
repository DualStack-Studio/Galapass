import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { X as XIcon, Volume2 as Volume2Icon, VolumeX as VolumeXIcon } from 'lucide-react';

// ✅ Import the new custom hook
import { useTourDetail } from '../../hooks/useTourDetail';

// Component and lightbox imports...
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import Calendar from "../../components/TouristView/TourDetail/Calendar.jsx";
import GeneralModal from "../../components/GeneralModal.jsx";
import TourHeader from "../../components/TouristView/TourDetail/TourHeader.jsx";
import MediaGallery from "../../components/TouristView/TourDetail/MediaGallery.jsx";
import TourCompanyInfo from "../../components/TouristView/TourDetail/TourCompanyInfo.jsx";
import BookingCard from "../../components/TouristView/TourDetail/BookingCard.jsx";
import Reviews from "../../components/TouristView/TourDetail/Reviews.jsx";

const formatDate = (dateString, options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) => {
    if (!dateString) return "Select a date";
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// --- MAIN PAGE COMPONENT ---
const TourDetailPage = () => {
    const { tourId } = useParams();

    const { tour, loading, error } = useTourDetail(tourId);

    // --- UI STATE (remains in the component) ---
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
    const [galleryLightboxOpen, setGalleryLightboxOpen] = useState(false);
    const [introLightboxOpen, setIntroLightboxOpen] = useState(true);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    // --- DERIVED STATE (useMemo hooks) ---
    const lightboxSlides = useMemo(() => {
        if (!tour?.media) return [];
        return tour.media.map(m => {
            if (m.type === 'VIDEO') {
                return {
                    type: 'video',
                    width: 1920,
                    height: 1080,
                    sources: [{ src: m.url, type: 'video/mp4' }]
                };
            }
            return { type: 'image', src: m.url, width: 1920, height: 1280 };
        });
    }, [tour?.media]);

    const introVideoIndex = useMemo(() => {
        if (!tour?.media) return -1;
        return tour.media.findIndex(m => m.type === 'VIDEO');
    }, [tour?.media]);

    const availableDates = useMemo(() => {
        if (!tour?.tourDates) return [];
        return tour.tourDates.map(d => ({ date: d.date, available: d.available }));
    }, [tour?.tourDates]);

    const totalPrice = useMemo(() => {
        if (!tour?.price) return '0.00';
        return (tour.price * guests).toFixed(2);
    }, [tour?.price, guests]);

    // --- EVENT HANDLERS ---
    const handleGuestChange = (amount) => setGuests(prev => Math.max(1, Math.min(tour?.maxGuests || 1, prev + amount)));
    const handleLikeToggle = () => setIsLiked(!isLiked);
    const openGalleryLightbox = (index) => {
        setActiveLightboxIndex(index);
        setGalleryLightboxOpen(true);
    };

    // --- RENDER LOGIC ---
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading tour details...</div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }
    if (!tour) {
        return <div className="flex justify-center items-center h-screen">Tour not found.</div>;
    }

    // The rest of your JSX remains exactly the same...
    return (
        <div className="font-sans antialiased">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Header Section */}
                <TourHeader
                    tour={{
                        title: tour.title,
                        averageRating: tour.averageRating,
                        reviewCount: tour.totalReviews,
                        location: tour.location,
                    }}
                    isLiked={isLiked}
                    onLikeToggle={handleLikeToggle}
                />

                {/* Media Gallery */}
                <MediaGallery
                    media={tour.media}
                    title={tour.title}
                    onOpenLightbox={openGalleryLightbox}
                />

                {/* Main Content Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-10">
                        <TourCompanyInfo tour={tour} />
                        <Reviews
                            tour={{
                                averageRating: tour.averageRating,
                                totalReviews: tour.totalReviews,
                                reviews: tour.reviews,
                            }}
                            formatDate={formatDate}
                        />
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:sticky lg:top-8 mt-8 lg:mt-0 h-fit">
                        <BookingCard
                            tour={{
                                price: tour.price,
                                maxGuests: tour.maxGuests,
                            }}
                            guests={guests}
                            handleGuestChange={handleGuestChange}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={setSelectedDate}
                            setCalendarModalOpen={setCalendarModalOpen}
                            totalPrice={totalPrice}
                            formatDate={formatDate}
                            upcomingDates={tour.tourDates}
                        />
                    </div>
                </div>
            </div>

            {/* --- RENDER THE LIGHTBOXES --- */}
            <Lightbox
                open={introLightboxOpen && introVideoIndex !== -1}
                close={() => setIntroLightboxOpen(false)}
                index={introVideoIndex}
                slides={lightboxSlides}
                plugins={[Video]}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
                video={{
                    controls: false,
                    autoPlay: true,
                    loop: true,
                    muted: isMuted
                }}
                toolbar={{
                    buttons: [
                        <button
                            key="mute-button"
                            type="button"
                            className="yarl__button"
                            onClick={() => setIsMuted(!isMuted)}
                        >
                            {isMuted ? <VolumeXIcon color="white" /> : <Volume2Icon color="white" />}
                        </button>,
                        "close"
                    ],
                }}
            />
            <Lightbox
                open={galleryLightboxOpen}
                close={() => setGalleryLightboxOpen(false)}
                index={activeLightboxIndex}
                slides={lightboxSlides}
                plugins={[Video]}
                video={{
                    controls: false,
                    autoPlay: true,
                    loop: true,
                    muted: isMuted
                }}
                toolbar={{
                    buttons: [
                        "prev",
                        "next",
                        <button
                            key="mute-button"
                            type="button"
                            className="yarl__button"
                            onClick={() => setIsMuted(!isMuted)}
                        >
                            {isMuted ? <VolumeXIcon color="white" /> : <Volume2Icon color="white" />}
                        </button>,
                        "close"
                    ],
                }}
            />
            <GeneralModal isOpen={isCalendarModalOpen} onClose={() => setCalendarModalOpen(false)}>
                <div className="relative">
                    <button onClick={() => setCalendarModalOpen(false)} className="absolute top-2 right-2 rounded-full hover:bg-gray-100 z-10 cursor-pointer">
                        <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <Calendar
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                            setSelectedDate(date);
                            setCalendarModalOpen(false);
                        }}
                    />
                </div>
            </GeneralModal>
        </div>
    );
};

export default TourDetailPage;