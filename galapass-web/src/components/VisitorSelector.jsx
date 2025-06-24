import React from 'react';

const VisitorSelector = ({ isVisible, onClose, visitors, onVisitorChange }) => {
    if (!isVisible) return null;

    const increment = () => {
        if (visitors < 16) {
            onVisitorChange(visitors + 1);
        }
    };

    const decrement = () => {
        if (visitors > 1) {
            onVisitorChange(visitors - 1);
        }
    };

    return (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50" style={{ width: '300px' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-gray-900">Visitors</h4>
                    <p className="text-sm text-gray-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={decrement}
                        disabled={visitors <= 1}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            visitors <= 1
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:scale-105'
                        }`}
                    >
                        <span className="text-lg font-light">−</span>
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
            {visitors}
          </span>
                    <button
                        onClick={increment}
                        disabled={visitors >= 16}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            visitors >= 16
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:scale-105'
                        }`}
                    >
                        <span className="text-lg font-light">+</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default VisitorSelector;