import React, { useState } from 'react';
import { Building, FileText, ShieldCheck, Ship, Check, AlertCircle } from 'lucide-react';

// --- Reusable Child Components ---

const FormSection = ({ icon, step, title, children }) => (
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

const FormTextarea = (props) => (
    <textarea {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
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

const Checkbox = ({ id, children }) => (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
        <input id={id} type="checkbox" className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5" />
        <label htmlFor={id} className="ml-3 text-sm text-gray-700">
            {children}
        </label>
    </div>
);

// --- Main Page Component ---
const BecomeOperatorForm = () => {
    const [formData, setFormData] = useState({}); // Basic state for form data

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert("Application submitted! (This is a demo)");
    };

    return (
        <div className="bg-gray-50 font-sans antialiased">
            <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Partner with Us in Galápagos</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Complete the following application to begin the process of becoming a certified tour operator on our platform, in compliance with all Galápagos regulations.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <FormSection step="1" title="Legal & Corporate Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FormLabel htmlFor="company-name">Company Legal Name</FormLabel>
                                <FormInput type="text" id="company-name" placeholder="Your Company S.A." />
                            </div>
                            <div>
                                <FormLabel htmlFor="ruc">R.U.C. Number</FormLabel>
                                <FormInput type="text" id="ruc" placeholder="1790000000001" />
                            </div>
                            <div>
                                <FormLabel htmlFor="legal-rep">Legal Representative Name</FormLabel>
                                <FormInput type="text" id="legal-rep" placeholder="Alex Johnson" />
                            </div>
                            <div>
                                <FormLabel htmlFor="rep-experience">Representative's Experience</FormLabel>
                                <FormSelect id="rep-experience">
                                    <option>University Degree in Tourism</option>
                                    <option>6+ Years Executive Experience</option>
                                    <option>Hiring a Qualified Manager</option>
                                </FormSelect>
                            </div>
                            <div className="md:col-span-2">
                                <FormLabel htmlFor="domicile">Proof of Domicile in Galápagos</FormLabel>
                                <FileInput id="domicile" description="Upload a utility bill or property record showing your company's physical address in the Galápagos province." />
                            </div>
                            <div className="md:col-span-2">
                                <FormLabel>Minimum Capital Declaration</FormLabel>
                                <Checkbox id="capital-declaration">
                                    I hereby declare that the company possesses the required minimum real asset value of **$8,000 USD** as stipulated by regulations.
                                </Checkbox>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection step="2" title="National & Municipal Permits">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FormLabel htmlFor="registro-turismo">Registro de Turismo Certificate</FormLabel>
                                <FileInput id="registro-turismo" description="Upload your certificate from the National Tourism Registry (SITURIN)." />
                            </div>
                            <div>
                                <FormLabel htmlFor="luaf">Annual Operating License (LUAF)</FormLabel>
                                <FileInput id="luaf" description="Upload your current LUAF from the Ministry of Tourism." />
                            </div>
                            <div className="md:col-span-2">
                                <FormLabel htmlFor="uso-suelo">Municipal Permit (Uso de Suelo)</FormLabel>
                                <FileInput id="uso-suelo" description="Upload your permit from the local municipal government in Galápagos certifying your office location." />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection step="3" title="Galápagos National Park Requirements">
                        <div className="space-y-6">
                            <div>
                                <FormLabel>Tourism Operation Quota (Cupo)</FormLabel>
                                <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <input id="cupo-ack" type="checkbox" className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5" />
                                    <label htmlFor="cupo-ack" className="ml-3 text-sm text-yellow-800">
                                        I understand that operating slots ("cupos") are extremely limited and are granted via public contest by the Governing Council. I acknowledge that this application does not guarantee a cupo.
                                    </label>
                                </div>
                            </div>
                            <div>
                                <FormLabel htmlFor="tour-modality">Desired Tour Modality</FormLabel>
                                <FormSelect id="tour-modality">
                                    <option>Land-Based Tour</option>
                                    <option>Daily Navigable Tour</option>
                                    <option>Live-Aboard Cruise</option>
                                    <option>Diving Tour</option>
                                </FormSelect>
                            </div>
                            <div>
                                <FormLabel htmlFor="environmental-plan">Environmental Management Plan</FormLabel>
                                <FormTextarea id="environmental-plan" rows="4" placeholder="Describe your plan to minimize environmental impact, manage waste, and contribute to conservation efforts..." />
                            </div>
                            <div>
                                <FormLabel htmlFor="itinerary-proposal">Proposed Itinerary</FormLabel>
                                <FormTextarea id="itinerary-proposal" rows="4" placeholder="Detail the specific sites you plan to visit and the activities at each site. This will be subject to Park Directorate approval." />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection step="4" title="Operational Details">
                        <div className="space-y-6">
                            <div>
                                <FormLabel htmlFor="office-address">Physical Office Address in Galápagos</FormLabel>
                                <FormInput type="text" id="office-address" placeholder="Av. Charles Darwin, Puerto Ayora" />
                            </div>
                            <div>
                                <FormLabel htmlFor="guide-plan">Certified Guide Hiring Plan</FormLabel>
                                <FormTextarea id="guide-plan" rows="3" placeholder="Describe your plan for hiring licensed Galápagos Naturalist Guides for all tours." />
                            </div>
                            <div>
                                <FormLabel htmlFor="vessel-details">Vessel Details (if applicable)</FormLabel>
                                <FormTextarea id="vessel-details" rows="3" placeholder="If using a boat, provide its name, capacity, and confirm it meets all environmental and safety standards." />
                            </div>
                        </div>
                    </FormSection>

                    <div className="text-center pt-6">
                        <button type="submit" className="w-full md:w-auto bg-teal-600 text-white font-bold text-lg py-3 px-12 rounded-lg hover:bg-teal-700 transition-colors shadow-lg">
                            Submit Application
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                            By submitting, you confirm that all information is accurate. Our team will review your application and contact you regarding the next steps.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

    export default BecomeOperatorForm;
