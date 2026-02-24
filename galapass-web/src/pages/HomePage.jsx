import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TouristDashboardPage from './tourist/TouristDashboardPage.jsx';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "OWNER") navigate('/owner/dashboard');
            else if (user.role === "GUIDE") navigate('/guide/dashboard');
            else if (user.role === "TOURIST") navigate('/tourist/dashboard');
        }
    }, [user, navigate]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <TouristDashboardPage /> {/* Default landing for visitors */}
        </div>
    );
};

export default HomePage;
