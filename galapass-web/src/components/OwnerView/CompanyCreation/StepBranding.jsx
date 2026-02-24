import React, { useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StepBranding = ({ uploadedLogo, handleFileSelect, removeLogo, isUploading, isDeleting }) => {
    const { t } = useTranslation();
    const logoInputRef = useRef(null);

    const handleLogoClick = () => {
        logoInputRef.current?.click();
    };

    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900">{t("add_company_logo")}</h2>
                <p className="text-lg text-gray-600">{t("upload_logo_subtitle")}</p>
            </div>

            <div className="max-w-md mx-auto">
                {!uploadedLogo && !isUploading ? (
                    <div
                        onClick={handleLogoClick}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 cursor-pointer transition-colors"
                    >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{t("upload_your_logo")}</h3>
                        <p className="text-gray-600 mb-4">{t("logo_requirements")}</p>
                        <button
                            type="button"
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            {t("choose_file")}
                        </button>
                    </div>
                ) : isUploading ? (
                    <div className="h-48 border-2 border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                            <p>{t("uploading_logo")}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative group">
                            <img
                                src={uploadedLogo.url}
                                alt={t("company_logo")}
                                className={`w-32 h-32 object-contain border bg-white border-gray-300 rounded-lg shadow-sm transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
                            />

                            {isDeleting && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                                    <Loader className="h-6 w-6 animate-spin text-gray-700" />
                                </div>
                            )}

                            {!isDeleting && (
                                <button
                                    type="button"
                                    onClick={() => removeLogo(uploadedLogo.url)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <X className="h-4 w-4 text-gray-800" />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogoClick}
                            disabled={isDeleting}
                            className="inline-flex items-center px-6 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {t("change_logo")}
                        </button>
                    </div>
                )}
            </div>

            <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
            />
        </div>
    );
};

export default StepBranding;
