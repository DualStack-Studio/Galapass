import React from "react";
import { AlertTriangle, X } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        // This modal has the highest z-index to ensure it appears on top of all others
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">An Error Occurred</h2>
                </div>
                <p className="text-gray-700 mb-6 ml-14">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
