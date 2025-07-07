import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // 1. Import useLocation
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoginModal from '../components/LoginModal.jsx';
import RegisterModal from '../components/RegisterModal.jsx';

const Layout = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // 2. Get the current location object

    // 3. Define the URL paths where the global footer should be hidden
    const pathsWithoutFooter = [
        "/owner/edit-tour",
        "/owner/add-tour",
        "/owner/add-company",
        "/owner/edit-company",
        "/owner/add-guide"
    ];

    // 4. Check if the current URL starts with any of the paths in our list
    const shouldHideFooter = pathsWithoutFooter.some(path => location.pathname.startsWith(path));

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onLoginClick={() => setIsLoginOpen(true)}
                onRegisterClick={() => setIsRegisterOpen(true)}
            />

            <main className="flex-1 bg-white">
                <Outlet />
            </main>

            {!shouldHideFooter && <Footer />}

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

export default Layout;
