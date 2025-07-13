import React, { useState } from 'react';
import { User, BookOpen, FileText, Check } from 'lucide-react';

// --- Reusable Child Components (from your provided aesthetic) ---

const FormSection = ({ step, title, children }) => (
    <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all bg-teal-600 border-teal-600 text-white">
                {step}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

const FormLabel = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-gray-700 mb-2">
        {children}
    </label>
);

const FormInput = (props) => (
    <input {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
);

const FormSelect = ({ children, ...props }) => (
    <select {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white">
        {children}
    </select>
);

const FileInput = ({ id, description }) => (
    <div>
        <input
            type="file"
            id={id}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
);

// --- Main Page Component ---
const BecomeGuideForm = () => {
    const [formData, setFormData] = useState({}); // Basic state for form data

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert("Application to become a guide submitted! (This is a demo)");
    };

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Become a Naturalist Guide</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Apply to join our platform as a certified Galápagos Naturalist Guide. Please provide the following information based on official requirements.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <FormSection step="1" title="Personal & Residential Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FormLabel htmlFor="full-name">Full Name</FormLabel>
                                <FormInput type="text" id="full-name" placeholder="Andrea Garcia" />
                            </div>
                            <div>
                                <FormLabel htmlFor="cedula">Ecuadorian ID (Cédula)</FormLabel>
                                <FormInput type="text" id="cedula" placeholder="1700000000" />
                            </div>
                            <div>
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <FormInput type="email" id="email" placeholder="andrea.garcia@email.com" />
                            </div>
                            <div>
                                <FormLabel htmlFor="phone">Phone Number</FormLabel>
                                <FormInput type="tel" id="phone" placeholder="099-000-0000" />
                            </div>
                            <div className="md:col-span-2">
                                <FormLabel htmlFor="residency-proof">Proof of Permanent Galápagos Residency</FormLabel>
                                <FileInput id="residency-proof" description="Upload your official Galápagos residency card. This is a mandatory requirement for all new guide applicants." />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection step="2" title="Educational & Language Qualifications">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FormLabel htmlFor="education-level">Highest Level of Education</FormLabel>
                                <FormSelect id="education-level">
                                    <option>High School Diploma (Bachiller)</option>
                                    <option>University Degree (Título de Tercer Nivel)</option>
                                </FormSelect>
                            </div>
                            <div>
                                <FormLabel htmlFor="university-degree">Degree Field (if applicable)</FormLabel>
                                <FormInput type="text" id="university-degree" placeholder="Biology, Tourism, Geology..." />
                            </div>
                            <div>
                                <FormLabel htmlFor="english-level">Certified English Level (CEFR)</FormLabel>
                                <FormSelect id="english-level">
                                    <option>B1</option>
                                    <option>B2 (Required Minimum)</option>
                                    <option>C1</option>
                                    <option>C2</option>
                                </FormSelect>
                            </div>
                            <div>
                                <FormLabel htmlFor="other-languages">Other Languages Spoken</FormLabel>
                                <FormInput type="text" id="other-languages" placeholder="e.g., German, French" />
                            </div>
                            <div className="md:col-span-2">
                                <FormLabel htmlFor="language-certs">Language Certifications</FormLabel>
                                <FileInput id="language-certs" description="Upload official certificates for all claimed language proficiencies." />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection step="3" title="Official Courses & Documentation">
                        <div className="space-y-6">
                            <div>
                                <FormLabel>Official Naturalist Guide Course</FormLabel>
                                <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <input id="course-ack" type="checkbox" className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5" />
                                    <label htmlFor="course-ack" className="ml-3 text-sm text-yellow-800">
                                        I understand that I must pass the official Naturalist Guide Course held by the Galápagos National Park Directorate to obtain a license. This application is a preliminary step.
                                    </label>
                                </div>
                            </div>
                            <div>
                                <FormLabel htmlFor="license-number">Current Guide License # (if renewing)</FormLabel>
                                <FormInput type="text" id="license-number" placeholder="GN-III-0000 (optional)" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <FormLabel htmlFor="police-record">Police Record (Récord Policial)</FormLabel>
                                    <FileInput id="police-record" description="Must be recent and show a clean record." />
                                </div>
                                <div>
                                    <FormLabel htmlFor="health-cert">Medical Certificate</FormLabel>
                                    <FileInput id="health-cert" description="Must be recent and certify physical fitness." />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    <div className="text-center pt-6">
                        <button type="submit" className="w-full md:w-auto bg-teal-600 text-white font-bold text-lg py-3 px-12 rounded-lg hover:bg-teal-700 transition-colors shadow-lg">
                            Submit Application
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                            Submitting this form adds you to our list of potential guide candidates. We will notify you when official courses are announced by the Park Directorate.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BecomeGuideForm;
