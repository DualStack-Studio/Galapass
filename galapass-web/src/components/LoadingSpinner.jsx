import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;