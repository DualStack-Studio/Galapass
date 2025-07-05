import React from "react";

const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          message,
                          title = "Confirm Action",
                          confirmButtonText = "Confirm",
                          confirmButtonColor = "bg-red-600 hover:bg-red-700"
                      }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md cursor-pointer ${confirmButtonColor}`}
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
