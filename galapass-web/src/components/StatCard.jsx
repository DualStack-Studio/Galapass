import React from "react";

const StatCard = ({ icon: Icon, title, value, subtitle, color = "emerald" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
            <div className={`p-3 rounded-lg bg-${color}-100`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </div>
    </div>
);

export default StatCard;