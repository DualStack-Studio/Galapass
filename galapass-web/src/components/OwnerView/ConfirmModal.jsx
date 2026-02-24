import React, { useState, useEffect } from "react";
import {useTranslation} from "react-i18next";


const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          message,
                          title,
                          confirmButtonText,
                          confirmButtonColor = "bg-red-600 hover:bg-red-700"
                      }) => {
    const {t} = useTranslation()

    // 1. Add state to control visibility
    const [isVisible, setIsVisible] = useState(isOpen);

    // 2. Add effect to handle animation timing
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 3. Update render condition
    if (!isVisible) return null;

    return (
        // 4. Conditionally apply animation to the overlay
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 ${
                isOpen ? 'animate-fade-in' : 'animate-fade-out'
            }`}
            onClick={onClose}
        >
            {/* 5. Conditionally apply animation to the modal content */}
            <div
                className={`bg-white rounded-lg shadow-lg w-full max-w-sm p-6 ${
                    isOpen ? 'animate-slide-up' : 'animate-slide-down'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md cursor-pointer ${confirmButtonColor}`}
                    >
                        {confirmButtonText}
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

export default ConfirmModal;