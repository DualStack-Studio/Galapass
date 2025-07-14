import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Heart, Shield, Users, Leaf } from 'lucide-react';

const TikTokIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="space-y-8 text-center">
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
                                {t('welcome')}
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://www.instagram.com/galapass.ec/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                                <a href="https://www.tiktok.com/@galapass.ec" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors" aria-label="TikTok">
                                    <TikTokIcon size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">{t('explore')}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('find_tours')}</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('local_guides')}</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('tour_operators')}</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('islands_guide')}</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('travel_tips')}</a>
                                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">{t('best_seasons')}</a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">{t('partners')}</h4>
                            <div className="space-y-2 text-sm">
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">{t('become_a_guide')}</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">{t('join_as_tour_operator')}</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">{t('partner_resources')}</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">{t('commission_structure')}</a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-emerald-400">{t('contact')}</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start justify-center gap-3">
                                    <MapPin size={16} className="text-emerald-400 mt-0.5" />
                                    <div className="text-gray-300">
                                        <p>{t('address_line_1')}</p>
                                        <p>{t('address_line_2')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Mail size={16} className="text-emerald-400" />
                                    <a href={`mailto:${t('email')}`} className="text-gray-300 hover:text-emerald-400 transition-colors">
                                        {t('email')}
                                    </a>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Phone size={16} className="text-emerald-400" />
                                    <a href={`tel:${t('phone')}`} className="text-gray-300 hover:text-emerald-400 transition-colors">
                                        {t('phone')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-center text-emerald-400">{t('our_commitment')}</h3>
                        <div className="space-y-6">
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Leaf size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">{t('sustainable_tourism')}</h4>
                                <p className="text-xs text-gray-300">{t('sustainable_tourism_desc')}</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Users size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">{t('local_community')}</h4>
                                <p className="text-xs text-gray-300">{t('local_community_desc')}</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Shield size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">{t('safe_adventures')}</h4>
                                <p className="text-xs text-gray-300">{t('safe_adventures_desc')}</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Heart size={24} />
                                </div>
                                <h4 className="font-medium text-emerald-400">{t('authentic_experiences')}</h4>
                                <p className="text-xs text-gray-300">{t('authentic_experiences_desc')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 text-center">
                        <div>
                            <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t('feedback_title')}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-3">{t('feedback_desc')}</p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfiVtV11ZKrvxNTwrBiINyjU0uIlC-SGILmIBBAGP1bTs_KQA/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                                <Mail size={16} />
                                {t('send_feedback')}
                            </a>
                        </div>

                        <div className="space-y-4 pt-6">
                            <h4 className="font-medium text-emerald-400">{t('support')}</h4>
                            <div className="space-y-2">
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">{t('help_center')}</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">{t('safety_guidelines')}</a>
                                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">{t('booking_support')}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-wrap gap-6 text-sm text-gray-400 justify-center md:justify-start">
                            <a href="#" className="hover:text-emerald-400 transition-colors">{t('privacy_policy')}</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">{t('terms_of_service')}</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">{t('cookie_policy')}</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">{t('cancellation_policy')}</a>
                        </div>
                        <div className="text-sm text-gray-400 text-center md:text-right">
                            <p>{t('copyright_notice')}</p>
                            <p className="text-xs mt-1">{t('responsible_travel')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
