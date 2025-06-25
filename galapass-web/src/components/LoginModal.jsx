import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

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