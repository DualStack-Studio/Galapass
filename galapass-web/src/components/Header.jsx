import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import CompactSearchBar from './TouristView/CompactSearchBar.jsx';
import { useTranslation } from 'react-i18next';

const Header = ({ isMenuOpen, setIsMenuOpen, onLoginClick, onRegisterClick, searchBarProps }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showStickySearch, setShowStickySearch] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const langDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'English' }
    ];

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setShowLangDropdown(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mostrar search sticky si scroll es suficiente
    useEffect(() => {
        const handleScroll = () => {
            setShowStickySearch(window.scrollY > 200 && location.pathname === '/');
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const handleLogoClick = () => {
        navigate('/tourist/dashboard');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
        setShowLangDropdown(false);
    };

    const getUserInitials = (name) => {
        return name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';
    };

    const getProfileImage = () => user?.profilePhoto || null;

    return (
        <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${showStickySearch ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80" onClick={handleLogoClick}>
                        <img src="/images/galapassLogo.png" alt="Galapass Logo" className="h-9 w-auto object-contain" />
                        <h1 className="text-xl font-bold text-emerald-700">Galapass</h1>
                    </div>

                    {/* Sticky SearchBar */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${showStickySearch && location.pathname === '/' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                        {searchBarProps && location.pathname === '/' && <CompactSearchBar {...searchBarProps} />}
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-3 ml-6">
                            {/* Language Dropdown (only if not logged in) */}
                            {!user && (
                                <div className="relative" ref={langDropdownRef}>
                                    <button
                                        onClick={() => setShowLangDropdown(prev => !prev)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center cursor-pointer"
                                    >
                                        {languages.find(l => l.code === i18n.language)?.label || 'Idioma'}
                                        <ChevronDown size={16} className="ml-2 text-gray-400" />
                                    </button>
                                    {showLangDropdown && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            {languages.map(lang => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${i18n.language === lang.code ? 'font-bold text-emerald-600' : 'text-gray-700'}`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* User dropdown */}
                            {user ? (
                                <div className="relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(prev => !prev)}
                                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                                            {getProfileImage() ? (
                                                <img src={getProfileImage()} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-sm font-medium">{getUserInitials(user.name)}</span>
                                            )}
                                        </div>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{t(`role.${user.role}`)}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <User size={16} />
                                                <span>{t('profile')}</span>
                                            </a>
                                            <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <Settings size={16} />
                                                <span>{t('settings')}</span>
                                            </a>
                                            {/* Language Dropdown inside user dropdown */}
                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <div className="relative" ref={langDropdownRef}>
                                                    <button
                                                        onClick={() => setShowLangDropdown(prev => !prev)}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                                                    >
                                                        {languages.find(l => l.code === i18n.language)?.label || 'Idioma'}
                                                        <ChevronDown size={16} className="ml-2 text-gray-400" />
                                                    </button>
                                                    {showLangDropdown && (
                                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                            {languages.map(lang => (
                                                                <button
                                                                    key={lang.code}
                                                                    onClick={() => handleLanguageChange(lang.code)}
                                                                    className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${i18n.language === lang.code ? 'font-bold text-emerald-600' : 'text-gray-700'}`}
                                                                >
                                                                    {lang.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                                            >
                                                <LogOut size={16} />
                                                <span>{t('logout')}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium cursor-pointer"
                                >
                                    {t('login')}
                                </button>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
                    <div className="px-4 py-2 space-y-1">
                        <div className="px-3 py-2">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 py-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                                            {getProfileImage() ? (
                                                <img src={getProfileImage()} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-sm font-medium">{getUserInitials(user.name)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                            <User size={16} />
                                            <span>{t('profile')}</span>
                                        </a>
                                        <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                            <Settings size={16} />
                                            <span>{t('settings')}</span>
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                                        >
                                            <LogOut size={16} />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={onLoginClick}
                                        className="flex-1 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium text-sm"
                                    >
                                        {t('login')}
                                    </button>
                                    <button
                                        onClick={onRegisterClick}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                    >
                                        {t('signup')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
