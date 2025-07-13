import React, { useState, useEffect } from 'react'; // Import useEffect
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        language: 'es',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // 1. Add state to control visibility for animations
    const [isVisible, setIsVisible] = useState(isOpen);

    // 2. Use an effect to handle the animation timing
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Wait for the animation to finish before unmounting
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration matches animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // 3. Change the render condition to use the new visibility state
    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        // ... (Your existing submit logic remains unchanged)
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) throw new Error("Registration failed");

            const userResponse = await fetch("http://localhost:8080/auth/me", {
                credentials: "include",
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                login(userData);
            }

            setFormData({ name: '', email: '', password: '', language: 'es' });
            onClose();
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        // ... (Your existing Google logic remains unchanged)
        try {
            const res = await fetch("http://localhost:8080/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Google login failed");

            const userRes = await fetch("http://localhost:8080/auth/me", {
                credentials: "include",
            });

            const userData = await userRes.json();
            login(userData);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        // 4. Conditionally apply animation to the overlay
        <div
            className={`fixed inset-0 bg-black/30 flex justify-center items-center z-50 ${
                isOpen ? 'animate-fade-in' : 'animate-fade-out'
            }`}
            onClick={onClose}
        >
            {/* 5. Conditionally apply animation to the modal content */}
            <div
                className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative ${
                    isOpen ? 'animate-slide-up' : 'animate-slide-down'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ... (Your existing modal content) ... */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500">Start your journey with Galapass</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ... (Your form inputs) ... */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                Language
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                disabled={isLoading}
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    >
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                {/* ... (Your Google button and 'Log In' link) ... */}
                <div className="relative mt-6 mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>
                <div className="relative">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log("Google Login Failed");
                        }}
                        render={({ onClick, disabled }) => (
                            <button
                                onClick={onClick}
                                disabled={disabled}
                                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                        )}
                    />
                    <div className="absolute inset-0 opacity-0 pointer-events-none">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log("Google Login Failed");
                            }}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                        />
                    </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="font-semibold text-emerald-600 hover:underline cursor-pointer"
                    >
                        Log in
                    </button>
                </p>
            </div>

            {/* 6. Add the CSS animations */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-out { animation: fade-out 0.3s ease-out forwards; }
                
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                
                @keyframes slide-down { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default RegisterModal;