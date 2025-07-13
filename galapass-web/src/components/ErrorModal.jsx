import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, message }) => {
    // 1. Add state to control visibility for animations
    const [isVisible, setIsVisible] = useState(isOpen);

    // 2. Use an effect to handle the animation timing
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Wait for the animation to finish before unmounting
            const timer = setTimeout(() => setIsVisible(false), 300); // Must match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 3. Change the render condition to use the new visibility state
    if (!isVisible) return null;

    return (
        <div
            // 4. Conditionally apply animation to the overlay
            className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/40 ${
                isOpen ? 'animate-fade-in' : 'animate-fade-out'
            }`}
            onClick={onClose}
        >
            <div
                // 5. Conditionally apply animation to the modal content
                className={`bg-white rounded-lg shadow-lg w-full max-w-sm p-6 ${
                    isOpen ? 'animate-slide-up' : 'animate-slide-down'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">An Error Occurred</h2>
                </div>
                <p className="text-gray-700 mb-6 ml-14">{message || "An unknown error has occurred."}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* 6. Add the CSS animations */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-out { animation: fade-out 0.3s ease-out forwards; }
                
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                
                @keyframes slide-down { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ErrorModal;