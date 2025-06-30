import React from 'react';
const StepProgress = ({ steps, currentStep }) => (
    <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
            <React.Fragment key={step.id}>
                <div className={`flex items-center ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-200'
                    }`}>
                        {step.id}
                    </div>
                    <div className="ml-3 hidden sm:block">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs">{step.description}</div>
                    </div>
                </div>
                {index < steps.length - 1 && (
                    <div className={`w-12 h-px ${currentStep > step.id ? 'bg-black' : 'bg-gray-200'}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);
export default StepProgress;
