import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const fetchUser = async () => {
        try {
            // Using 'include' to send cookies with the request
            const response = await axios.get("http://localhost:8080/auth/me", { withCredentials: true });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuthStatus = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/me", {
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear user state even if logout request fails
            setUser(null);
        }
    };

    const refreshUser = async () => {
        setIsLoading(true);
        await fetchUser();
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        checkAuthStatus,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};