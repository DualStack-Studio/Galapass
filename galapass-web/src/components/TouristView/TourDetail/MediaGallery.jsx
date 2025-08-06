import React from 'react';
import { PlayCircle, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MediaGallery = ({ media, title, onOpenLightbox }) => {
    const { t } = useTranslation();
    const galleryMedia = media.slice(0, 5);

    return (
        <div className="mb-8 lg:mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[250px] md:h-[450px]">
                {galleryMedia.map((mediaItem, index) => {
                    // Determine if the current item is a video
                    const isVideo = mediaItem.type === 'VIDEO';

                    return (
                        <div
                            key={index}
                            className={`relative cursor-pointer group rounded-lg overflow-hidden ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                            onClick={() => onOpenLightbox(index)}
                        >
                            {/* ✅ Conditionally render a <video> or <img> tag */}
                            {isVideo ? (
                                <video
                                    src={mediaItem.url}
                                    muted
                                    loop
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <img
                                    src={mediaItem.url} // Your API provides a 'url', not 'thumbnailUrl'
                                    alt={`${title} media ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}

                            {/* This overlay logic for the play button is correct */}
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                {isVideo && (
                                    <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                                )}
                            </div>

                            {/* This logic for showing "+X more" is also correct */}
                            {index === 4 && media.length > 5 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-center">
                                    <div>
                                        <Camera className="w-8 h-8 mx-auto mb-1" />
                                        <span className="text-lg font-bold">{t('media_gallery.more', {count: media.length - 5})}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MediaGallery;