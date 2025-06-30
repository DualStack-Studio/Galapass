import { DollarSign } from 'lucide-react';

const StepPricing = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Set your price</h2>
                <p className="text-lg text-gray-600">
                    You can change this anytime. We'll help you price competitively.
                </p>
            </div>

            <div className="max-w-md mx-auto">
                <div className="text-center">
                    <div className="relative inline-block">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400" />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="pl-16 pr-8 py-6 text-4xl font-bold text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black w-full"
                            placeholder="0"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <p className="text-lg text-gray-600 mt-4">per person</p>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-4">Pricing tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Research similar tours in your area</li>
                        <li>• Consider your unique value proposition</li>
                        <li>• Factor in all costs and desired profit</li>
                        <li>• Start competitive and adjust based on demand</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StepPricing;
