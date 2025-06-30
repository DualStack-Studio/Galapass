import { Upload, X } from "lucide-react";

const StepBranding = ({ uploadedLogo, handleFileSelect, removeLogo, isUploading }) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold">Add your company logo</h2>
                <p className="text-lg text-gray-600">Upload a logo for your brand identity</p>
            </div>

            <div className="max-w-md mx-auto">
                {!uploadedLogo ? (
                    <label className="block cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="sr-only"/>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-xl mb-2">Upload your logo</h3>
                            <p className="text-gray-600 mb-4">PNG or JPG up to 2MB</p>
                            <span className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                                Choose File
                            </span>
                        </div>
                    </label>
                ) : (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <img
                                src={uploadedLogo.url}
                                alt="Company Logo"
                                className="w-32 h-32 object-contain border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={removeLogo}
                                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border hover:bg-gray-100 transition cursor-pointer"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        </div>

                        <label>
                            <input type="file" accept="image/*" onChange={handleFileSelect} className="sr-only"/>
                            <div className="inline-flex items-center px-6 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition">
                                Change Logo
                            </div>
                        </label>
                    </div>
                )}

                {isUploading && (
                    <div className="text-center mt-4">
                        <span className="text-blue-600">Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepBranding;
