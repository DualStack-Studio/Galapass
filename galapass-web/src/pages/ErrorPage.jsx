import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error); // Log to console for debugging

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="max-w-xl text-center">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Oops! Something went wrong.</h1>
                <p className="text-lg text-gray-600 mb-6">
                    {error?.statusText || error?.message || "An unexpected error occurred."}
                </p>
                {error?.status && (
                    <p className="text-md text-gray-500 mb-4">Error Code: {error.status}</p>
                )}
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
