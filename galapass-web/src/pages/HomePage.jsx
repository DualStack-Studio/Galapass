import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import RegisterModal from "../components/RegisterModal.jsx";
import TouristDashboard from "../components/TouristView/TouristDashboard.jsx";
import OwnerDashboard from "../components/OwnerView/OwnerDashboard.jsx";

const HomePage = () => {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoading, user } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    const getRoleView = (role) => {
        switch (role) {
            case "GUIDE":
                return <TouristDashboard />;
            case "OWNER":
                return <OwnerDashboard user={user} />;
            case "TOURIST":
                return <TouristDashboard user={user} />;
            default:
                return <TouristDashboard />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onLoginClick={() => setIsLoginOpen(true)}
                onRegisterClick={() => setIsRegisterOpen(true)}
            />

            <main>
                {user ? getRoleView(user.role) : <TouristDashboard />}
            </main>

            <Footer />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </div>
    );
};

export default HomePage;
