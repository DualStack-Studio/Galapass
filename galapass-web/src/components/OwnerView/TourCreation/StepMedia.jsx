import React, { useRef } from 'react';
import { Upload, Plus, X, Video as VideoIcon, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StepMedia = ({
                       media,
                       onImageSelect,
                       onVideoSelect,
                       onMediaRemove,
                       isUploading,
                       isDeleting,
                       tourId
                   }) => {
    const { t } = useTranslation();
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const images = media.filter(m => m.type === 'IMAGE');
    const video = media.find(m => m.type === 'VIDEO');

    const isDisabled = !tourId;

    const handleImageClick = () => {
        if (isDisabled) {
            alert(t('stepMedia.complete_step'));
            return;
        }
        imageInputRef.current?.click();
    };

    const handleVideoClick = () => {
        if (isDisabled) {
            alert(t('stepMedia.complete_step'));
            return;
        }
        videoInputRef.current?.click();
    };

    return (
        <div className={`space-y-12 relative ${isDisabled ? 'opacity-60' : ''}`}>
            {isDisabled && (
                <div
                    className="absolute inset-0 z-10"
                    title={t('stepMedia.complete_step')}
                ></div>
            )}

            {/* --- Photo Upload Section --- */}
            <div>
                <div className="text-center py-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {t('stepMedia.add_photos')}
                    </h2>
                    <p className="text-lg text-gray-600">
                        {t('stepMedia.share_experience')}
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    {images.length === 0 && !isUploading.image ? (
                        <div
                            onClick={handleImageClick}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 cursor-pointer transition-colors"
                        >
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {t('stepMedia.upload_photos')}
                            </h3>
                            <button type="button" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                                {t('stepMedia.choose_files')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((img, index) => (
                                <div key={img.url} className="relative group aspect-w-1 aspect-h-1">
                                    <img
                                        src={img.url}
                                        alt={`Tour photo ${index + 1}`}
                                        className={`w-full h-full object-cover rounded-lg transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
                                    />
                                    {isDeleting && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                            <Loader className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    )}
                                    {!isDeleting && (
                                        <button
                                            type="button"
                                            onClick={() => onMediaRemove(img.url)}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <X className="h-4 w-4 text-gray-800" />
                                        </button>
                                    )}
                                    {index === 0 && !isDeleting && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                                            {t('stepMedia.cover')}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isUploading.image && (
                                <div className="h-48 border-2 border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                        <p>{t('stepMedia.uploading')}</p>
                                    </div>
                                </div>
                            )}
                            {images.length > 0 && images.length < 10 && !isUploading.image && !isDeleting && (
                                <div
                                    onClick={handleImageClick}
                                    className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <div className="text-center">
                                        <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">{t('stepMedia.add_more')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Divider --- */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-3 text-sm font-medium text-gray-500">
                        {t('stepMedia.optional')}
                    </span>
                </div>
            </div>

            {/* --- Video Upload Section --- */}
            <div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {t('stepMedia.add_video')}
                    </h2>
                    <p className="text-lg text-gray-600">
                        {t('stepMedia.showcase_video')}
                    </p>
                </div>
                <div className="max-w-2xl mx-auto mt-8">
                    {video ? (
                        <div className="relative group">
                            <video
                                src={video.url}
                                controls
                                className={`w-full rounded-xl shadow-md transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
                            />
                            {isDeleting && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                                    <Loader className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                            {!isDeleting && (
                                <button
                                    type="button"
                                    onClick={() => onMediaRemove(video.url)}
                                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <X className="h-5 w-5 text-gray-800" />
                                </button>
                            )}
                        </div>
                    ) : isUploading.video ? (
                        <div className="h-48 border-2 border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                <p>{t('stepMedia.uploading_video')}</p>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={handleVideoClick}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 cursor-pointer transition-colors"
                        >
                            <VideoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {t('stepMedia.upload_video')}
                            </h3>
                            <button type="button" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                                {t('stepMedia.choose_file')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden file inputs */}
            <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onImageSelect(e.target.files)}
                className="hidden"
                disabled={isDeleting}
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => onVideoSelect(e.target.files[0])}
                className="hidden"
                disabled={isDeleting}
            />
        </div>
    );
};

export default StepMedia;
