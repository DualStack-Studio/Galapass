import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Save, X } from 'lucide-react';

// --- MOCK DATA ---
// This data would be fetched for the currently logged-in user.
const currentUserData = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "099-123-4567",
    profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    bio: "Passionate about conservation and exploring the unique wildlife of the Galápagos. I love hiking, snorkeling, and sharing stories from my travels.",
};

// --- Reusable Child Components ---
const FormSection = ({ title, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">{title}</h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const FormField = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-bold text-gray-700 mb-1">
            {label}
        </label>
        {children}
    </div>
);

const FormInput = (props) => (
    <input {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
);

const FormTextarea = (props) => (
    <textarea {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
);

// --- MAIN PAGE COMPONENT ---
const EditProfilePage = () => {
    const [formData, setFormData] = useState(currentUserData);
    const [newProfilePhoto, setNewProfilePhoto] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewProfilePhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the API call to update the user's profile
        alert("Profile updated successfully! (This is a demo)");
    };

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Edit Profile
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Keep your personal details up to date.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <FormSection title="Personal Information">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    src={newProfilePhoto || formData.profilePhotoUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <label htmlFor="profilePhoto" className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                                    <Camera className="w-5 h-5 text-gray-600" />
                                    <input type="file" id="profilePhoto" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                </label>
                            </div>
                            <div className="flex-grow">
                                <FormField label="Full Name" htmlFor="name">
                                    <FormInput
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </FormSection>

                    {/* Contact Details Section */}
                    <FormSection title="Contact Details">
                        <FormField label="Email Address" htmlFor="email">
                            <FormInput
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled // Usually email is not editable
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed.</p>
                        </FormField>
                        <FormField label="Phone Number" htmlFor="phone">
                            <FormInput
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </FormField>
                    </FormSection>

                    {/* About You Section */}
                    <FormSection title="About You">
                        <FormField label="Your Bio" htmlFor="bio">
                            <FormTextarea
                                id="bio"
                                rows="5"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us a little about yourself..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Share your passion for travel and adventure!</p>
                        </FormField>
                    </FormSection>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row-reverse items-center gap-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-colors bg-teal-600 hover:bg-teal-700"
                        >
                            <Save className="w-5 h-5"/>
                            <span>Save Changes</span>
                        </button>
                        <button
                            type="button"
                            className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
