import React, { useState } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoginModal from '../components/LoginModal.jsx';
import RegisterModal from '../components/RegisterModal.jsx';
import { motion } from "framer-motion";

const Layout = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Define the URL paths where the global footer should be hidden
    const pathsWithoutFooter = [
        "/owner/edit-tour",
        "/owner/add-tour",
        "/owner/add-company",
        "/owner/edit-company",
        "/owner/add-guide"
    ];

    // Check if the current URL starts with any of the paths in our list
    const shouldHideFooter = pathsWithoutFooter.some(path => location.pathname.startsWith(path));

    // SearchBar state and handlers for dynamic header
    const [searchData, setSearchData] = useState({
        destination: '',
        startDate: '',
        tourists: 1
    });
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleInputChange = (field, value) => {
        setSearchData(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        console.log('Searching with:', searchData);
        // Add your search logic here
    };

    const handleFiltersChange = (type, values) => {
        setActiveFilterCount(values.length);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onLoginClick={() => setIsLoginOpen(true)}
                onRegisterClick={() => setIsRegisterOpen(true)}
                // Pass search bar props for dynamic header
                searchBarProps={{
                    searchData,
                    handleInputChange,
                    handleSearch,
                    onFiltersChange: handleFiltersChange,
                    setIsFilterModalOpen,
                    activeFilterCount
                }}
            />

            <motion.div
                key={location.pathname} // Add key to re-trigger animation on route change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }} // A slightly faster transition feels better
            >
                <main className="flex-1">
                    <Outlet />
                </main>
            </motion.div>

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

            {/* 👇 Add the ScrollRestoration component here */}
            <ScrollRestoration />
        </div>
    );
};

export default Layout;