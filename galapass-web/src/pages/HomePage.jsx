import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import TourCard from '../components/TourCard';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import RegisterModal from "../components/RegisterModal.jsx";
import UserDashboard from "../components/UserDashboard.jsx";
import OwnerDashboard from "../components/OwnerDashboard.jsx";

const HomePage = () => {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoading, user } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    const getRoleView = (role) => {
        switch (role) {
            case "GUIDE":
            case "OWNER":
                return <OwnerDashboard user={user} />;
            case "USER":
                return <UserDashboard user={user} />;
            default:
                return <UserDashboard />;
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onLoginClick={() => setIsLoginOpen(true)}
                onRegisterClick={() => setIsRegisterOpen(true)}
            />

            <main>
                {user ? getRoleView(user.role) : <UserDashboard />}
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
