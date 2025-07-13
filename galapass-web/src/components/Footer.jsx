import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Heart, Shield, Users, Leaf } from 'lucide-react';

// TikTok icon component since it's not available in lucide-react
const TikTokIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content - Three Columns */}
                <div className="py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Main Footer Content */}
                    <div className="space-y-8 text-center">
                        {/* Company Info */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-center gap-2">
                                <img
                                    src="/images/galapassLogo.png"
                                    alt="Galapass Logo"
                                    className="h-8 w-auto object-contain filter brightness-0 invert"
                                />
                                <h3 className="text-xl font-bold text-emerald-400">Galapass</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Your gateway to sustainable Galápagos adventures. Connecting travelers with certified local guides and responsible tour operators.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://www.instagram.com/galapass.ec/" target="_blank" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <Twitter size={20} />
                                </a>
                                <a href="https://www.tiktok.com/@galapass.ec" target="_blank" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <TikTokIcon size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">Explore</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Find Tours</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Local Guides</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Tour Operators</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Islands Guide</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Travel Tips</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Best Seasons</a>
                            </div>
                        </div>

                        {/* Partners */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">Partners</h4>
                            <div className="space-y-2 text-sm">
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">Become a Guide</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">Join as Tour Operator</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">Partner Resources</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">Commission Structure</a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">Contact</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start justify-center gap-3">
                                    <MapPin size={16} className="text-emerald-400 mt-0.5" />
                                    <div className="text-gray-300">
                                        <p>Puerto Ayora, Santa Cruz</p>
                                        <p>Galápagos Islands, Ecuador</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Mail size={16} className="text-emerald-400" />
                                    <a href="mailto:info@galapass.com" className="text-gray-300 hover:text-emerald-400 transition-colors">
                                        info@galapass.com
                                    </a>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Phone size={16} className="text-emerald-400" />
                                    <a href="tel:+593987654321" className="text-gray-300 hover:text-emerald-400 transition-colors">
                                        +593 98 765 4321
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column - Values Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-center text-emerald-400">Our Commitment</h3>
                        <div className="space-y-6">
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Leaf size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">Sustainable Tourism</h4>
                                <p className="text-xs text-gray-300">Protecting the unique ecosystem for future generations</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Users size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">Local Community</h4>
                                <p className="text-xs text-gray-300">Supporting local guides and businesses</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Shield size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">Safe Adventures</h4>
                                <p className="text-xs text-gray-300">Certified guides and safety-first approach</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Heart size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">Authentic Experiences</h4>
                                <p className="text-xs text-gray-300">Real connections with nature and culture</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Feedback Section */}
                    <div className="space-y-6 text-center">
                        <div>
                            <h3 className="text-xl font-semibold text-emerald-400 mb-3">Do you have feedback or suggestions?</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                Help us improve Galapass by sharing your feedback. Your input is invaluable for creating the best Galápagos experience.
                            </p>
                            <p className="text-gray-400 text-xs">
                                Ayúdanos a mejorar Galapass compartiendo tu opinión. Tu feedback es invaluable para crear la mejor experiencia en las Galápagos.
                            </p>
                        </div>

                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfiVtV11ZKrvxNTwrBiINyjU0uIlC-SGILmIBBAGP1bTs_KQA/viewform?usp=sf_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                            <Mail size={16} />
                            Send Feedback / Enviar Feedback
                        </a>

                        {/* Support Links */}
                        <div className="space-y-4 pt-6">
                            <h4 className="font-medium text-emerald-400">Support</h4>
                            <div className="space-y-2">
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">Help Center</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">Safety Guidelines</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">Booking Support</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal & Copyright */}
                <div className="py-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-wrap gap-6 text-sm text-gray-400 justify-center md:justify-start">
                            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Cancellation Policy</a>
                        </div>
                        <div className="text-sm text-gray-400 text-center md:text-right">
                            <p>&copy; 2025 Galapass. All rights reserved.</p>
                            <p className="text-xs mt-1">Explore the Galápagos responsibly 🐢</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;