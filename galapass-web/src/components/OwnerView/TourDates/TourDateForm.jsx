import React from "react";
import { Save, X, Trash2 } from "lucide-react";

const TourDateForm = ({
                          editingDate,
                          newTourDate,
                          setNewTourDate,
                          handleSaveTourDate,
                          handleCancelEdit,
                          handleDeleteTourDate,
                          totalPeopleBooked
                      }) => {
    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingDate ? "Edit Tour Date" : "Create Tour Date"}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="text"
                        value={newTourDate.date ? formatDate(newTourDate.date) : ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                        type="number"
                        value={newTourDate.price}
                        onChange={(e) => setNewTourDate(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="150"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                    <input
                        type="number"
                        value={newTourDate.maxGuests}
                        onChange={(e) => setNewTourDate(prev => ({ ...prev, maxGuests: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="12"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="available"
                        checked={newTourDate.available}
                        onChange={(e) => setNewTourDate(prev => ({ ...prev, available: e.target.checked }))}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="text-sm font-medium text-gray-700">
                        Available for booking
                    </label>
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        onClick={handleSaveTourDate}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        <span>Create</span>
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                    </button>
                </div>

                {editingDate && (
                    <button
                        onClick={() => handleDeleteTourDate(editingDate.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                        disabled={totalPeopleBooked > 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Tour Date</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TourDateForm;
