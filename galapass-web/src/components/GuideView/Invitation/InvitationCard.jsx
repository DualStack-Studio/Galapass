import React from "react";
import { Building2, Mail, Clock, Check, X } from "lucide-react";

const InvitationCard = ({ invitation, onAccept, onDecline }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {invitation.companyName || invitation.company || "Unknown Company"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Invitation to join as a guide
                            </p>
                        </div>
                    </div>

                    {invitation.email && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{invitation.email}</span>
                        </div>
                    )}

                    {invitation.name && (
                        <p className="text-sm text-gray-500 mb-3">Invited by {invitation.name}</p>
                    )}

                    {invitation.message && (
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {invitation.message}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                            Received {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString() : 'recently'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onAccept(invitation.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            <span>Accept</span>
                        </button>
                        <button
                            onClick={() => onDecline(invitation)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationCard;