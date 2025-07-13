import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import CompactSearchBar from './TouristView/CompactSearchBar.jsx';

const Header = ({ isMenuOpen, setIsMenuOpen, onLoginClick, onRegisterClick, searchBarProps }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRoleChanging, setIsRoleChanging] = useState(false);
    const [showStickySearch, setShowStickySearch] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Dynamic header scroll behavior - only on home page
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Show sticky search when scrolled past 80px AND on home page
            if (scrollY > 200 && location.pathname === '/') {
                setShowStickySearch(true);
            } else {
                setShowStickySearch(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    const handleRoleChange = async (newRole, dashboardPath) => {
        if (!user?.id || isRoleChanging) return;

        setIsRoleChanging(true);

        try {
            const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: newRole
                })
            });


            if (response.ok) {
                // You might want to update the user context here
                await refreshUser(); // if you have a method to refresh user data

                // Navigate to the appropriate dashboard
                navigate(dashboardPath);

                // Close mobile menu if open
                setIsMenuOpen(false);
            } else {
                console.error('Failed to change role:', response.statusText);
                // You might want to show an error message to the user
                alert('Failed to change role. Please try again.');
            }
        } catch (error) {
            console.error('Error changing role:', error);
            alert('An error occurred while changing role. Please try again.');
        } finally {
            setIsRoleChanging(false);
        }
    };

    const handleBecomeGuide = () => {
        if (!user) {
            onLoginClick();
            return;
        }
        handleRoleChange('GUIDE', '/guide/dashboard');
    };

    const handleBecomeTourOperator = () => {
        if (!user) {
            onLoginClick();
            return;
        }
        handleRoleChange('OWNER', '/owner/dashboard');
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const getProfileImage = () => {
        // Return user's profile picture if available, otherwise return null for initials fallback
        return user?.profilePhoto || null;
    };

    return (
        <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
            showStickySearch ? 'shadow-lg' : 'shadow-sm'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleLogoClick}
                    >
                        <img
                            src="/images/galapassLogo.png"
                            alt="Galapass Logo"
                            className="h-9 w-auto object-contain"
                        />
                        <h1 className="text-xl font-bold text-emerald-700">Galapass</h1>
                    </div>

                    {/* Compact Search Bar (appears on scroll AND only on home page) */}
                    <div
                        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
                            showStickySearch && location.pathname === '/'
                                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                : 'opacity-0 -translate-y-4 pointer-events-none'
                        }`}
                    >
                        {searchBarProps && location.pathname === '/' && (
                            <CompactSearchBar {...searchBarProps} />
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-3 ml-6">
                            {user ? (
                                // User Profile Dropdown
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                                            {getProfileImage() ? (
                                                <img
                                                    src={getProfileImage()}
                                                    alt={user.name || 'User'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-sm font-medium">
                                                    {getUserInitials(user.name)}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            {(() => {
                                                const roleMap = {
                                                    GUIDE: "Guide",
                                                    OWNER: "Tour Operator",
                                                    TOURIST: "Tourist",
                                                    ADMIN: "Admin"
                                                };
                                                const role = roleMap[user.role] || "Tourist";

                                                return (
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{role}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                );
                                            })()}
                                            <a
                                                href="#"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <User size={16} />
                                                <span>Profile</span>
                                            </a>
                                            <a
                                                href="#"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Settings size={16} />
                                                <span>Settings</span>
                                            </a>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Login Button (when not authenticated)
                                <button
                                    onClick={onLoginClick}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                >
                                    Log in
                                </button>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
                    <div className="px-4 py-2 space-y-1">
                        {user?.role !== "OWNER" && (
                            <>
                                {user?.role !== "GUIDE" && (
                                    <button
                                        onClick={handleBecomeGuide}
                                        disabled={isRoleChanging}
                                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRoleChanging ? 'Processing...' : 'Become a Guide'}
                                    </button>
                                )}
                                <button
                                    onClick={handleBecomeTourOperator}
                                    disabled={isRoleChanging}
                                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRoleChanging ? 'Processing...' : 'Become a Tour Operator'}
                                </button>
                            </>
                        )}

                        <div className="px-3 py-2">
                            {user ? (
                                // Mobile User Menu
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 py-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                                            {getProfileImage() ? (
                                                <img
                                                    src={getProfileImage()}
                                                    alt={user.name || 'User'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white text-sm font-medium">
                                                    {getUserInitials(user.name)}
                                                </span>
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
                                            <span>Profile</span>
                                        </a>
                                        <a href="#" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Mobile Login Buttons
                                <div className="flex space-x-2">
                                    <button
                                        onClick={onLoginClick}
                                        className="flex-1 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium text-sm"
                                    >
                                        Log in
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                                        Sign up
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