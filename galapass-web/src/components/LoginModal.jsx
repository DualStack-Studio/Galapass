import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Invalid credentials");

      // Get user data after successful login
      const userResponse = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        login(userData); // Update auth context
      }

      onClose(); // Close the modal
      // Reset form
      setEmail('');
      setPassword('');
      // Optionally navigate to a different page
      // navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
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
      // Modal Overlay
      <div
          className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={onClose}
      >
        {/* Modal Content */}
        <div
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to log in.</p>
          </div>

          {/* Error Message */}
          {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    required
                    disabled={isLoading}
                />
              </div>
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    required
                    disabled={isLoading}
                />
              </div>
            </div>

            <div className="text-right mt-2">
              <a href="#" className="text-sm text-emerald-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Custom Styled Google Login Button */}
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

            {/* Fallback if render prop doesn't work */}
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-emerald-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
  );
};

export default LoginModal;