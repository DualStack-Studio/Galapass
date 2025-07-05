import React from "react";
import { User, Mail } from "lucide-react";

const InvitationCard = ({ invitation, onAccept, onDecline }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {invitation.company?.logo ? (
                            <img
                                src={invitation.company.logo}
                                alt={invitation.company.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <User className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {invitation.company?.name || "Unnamed Company"}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {invitation.company?.email || "No email"}
                        </p>
                    </div>
                </div>
                <span className="text-sm font-medium text-yellow-600">
                    {invitation.status}
                </span>
            </div>

            {invitation.message && (
                <div className="text-sm text-gray-700 mb-4 italic">
                    “{invitation.message}”
                </div>
            )}

            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => onDecline(invitation.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                    Decline
                </button>
                <button
                    onClick={() => onAccept(invitation.id)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default InvitationCard;
