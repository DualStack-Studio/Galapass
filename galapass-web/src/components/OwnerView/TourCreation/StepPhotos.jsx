import React from 'react';
import { Upload, Plus, X } from 'lucide-react';

const StepPhotos = ({
                        uploadedImages,
                        handleImageUpload,
                        removeImage,
                        isUploading,
                        fileInputRef,
                        handleFileSelect,
                    }) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Add some photos of your tour</h2>
                <p className="text-lg text-gray-600">
                    Share what makes your experience special. You can add up to 10 photos.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {uploadedImages.length === 0 ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 cursor-pointer transition-colors"
                    >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Upload your photos</h3>
                        <p className="text-gray-600 mb-4">Drag and drop or click to select</p>
                        <button
                            type="button"
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Choose Files
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {uploadedImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                    <img
                                        src={image.url}
                                        alt={`Tour photo ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeImage(image.id)}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs rounded">
                                            Cover Photo
                                        </div>
                                    )}
                                </div>
                            ))}
                            {uploadedImages.length < 10 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <div className="text-center">
                                        <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">Add more</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {isUploading && (
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-blue-600">Uploading photos...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepPhotos;
