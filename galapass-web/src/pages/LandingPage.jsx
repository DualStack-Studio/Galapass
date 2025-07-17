import React, { useState, useEffect } from 'react';
import { Users, Shield, MapPin, ArrowRight, Play, Compass, Camera, Waves, Sun, Mountain, Fish } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const GalapassLanding = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState({});

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[id^="animate-"]');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);


    const features = [
        {
            icon: Users,
            title: "Operadores Turísticos",
            description: "Crea y administra tus ofertas de tours con nuestra plataforma intuitiva. Conéctate con viajeros de todo el mundo."
        },
        {
            icon: Compass,
            title: "Guías Expertos",
            description: "Únete a nuestra red de guías certificados y lidera expediciones inolvidables por las islas."
        },
        {
            icon: Camera,
            title: "Experiencias Inolvidables",
            description: "Descubre encuentros únicos con la vida silvestre y paisajes impresionantes que no existen en ningún otro lugar de la Tierra."
        }
    ];

    const stats = [
        { label: "Tours Disponibles", icon: MapPin },
        { label: "Guías Certificados", icon: Users },
        { label: "Opciones de Viaje", icon: Shield }
    ];

    // Removed testimonials array entirely

    const FloatingCard = ({ children, className = "" }) => (
        <div className={`relative group ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>


            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div
                        id="animate-hero"
                        className={`transition-all duration-1000 ${isVisible['animate-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 mb-8">
                            <Waves className="w-5 h-5" />
                            <span className="text-sm font-medium">Descubre las Islas Galápagos</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
                            Galapass
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Tu plataforma de confianza para explorar las Islas Galápagos. Conectamos operadores turísticos, guías expertos y viajeros apasionados.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <button onClick={() => {navigate(`/`)}} className="group bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 cursor-pointer">
                                <Play className="w-5 h-5" />
                                Explorar Tours
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-1/4 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
                    <Fish className="w-8 h-8 text-blue-300/60" />
                </div>
                <div className="absolute top-1/3 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
                    <Sun className="w-10 h-10 text-yellow-300/60" />
                </div>
                <div className="absolute bottom-1/4 left-1/4 animate-bounce" style={{ animationDelay: '2s' }}>
                    <Mountain className="w-9 h-9 text-green-300/60" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        id="animate-stats"
                        className={`grid grid-cols-2 md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible['animate-stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        {stats.map((stat, index) => (
                            <FloatingCard key={index} className="text-center">
                                <stat.icon className="w-8 h-8 text-blue-300 mx-auto mb-4" />
                                <div className="text-white/70 text-lg">{stat.label}</div> {/* Adjusted for no numbers */}
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        id="animate-features-title"
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['animate-features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Conectamos el Ecosistema Turístico
                        </h2>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto">
                            Una plataforma integral que une a operadores turísticos, guías certificados y viajeros en una experiencia única.
                        </p>
                    </div>

                    <div
                        id="animate-features"
                        className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible['animate-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        {features.map((feature, index) => (
                            <FloatingCard key={index} className="group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        id="animate-tech"
                        className={`text-center transition-all duration-1000 ${isVisible['animate-tech'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            Tecnología Moderna y Confiable
                        </h2>

                        <FloatingCard className="flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="text-left">
                                    <h3 className="text-2xl font-semibold text-white mb-6">Funcionalidades Clave</h3>
                                    <div className="space-y-4 text-white/80">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-blue-400" />
                                            <span>Autenticación segura por roles</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-green-400" />
                                            <span>Gestión completa de tours</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-yellow-400" />
                                            <span>Red de guías certificados</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Camera className="w-5 h-5 text-purple-400" />
                                            <span>Galería multimedia avanzada</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        id="animate-cta"
                        className={`transition-all duration-1000 ${isVisible['animate-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <FloatingCard>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                ¿Listo para comenzar?
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Únete a la plataforma líder en turismo de Galápagos. Crea tu cuenta y comienza a explorar las maravillas naturales más únicas del mundo.
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <button onClick={() => {navigate('/')}} className="group bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 justify-center cursor-pointer">
                                    <Compass className="w-5 h-5" />
                                    Buscar Tours
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GalapassLanding;