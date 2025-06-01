import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, LogIn, Book, Users, Clock } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import heroImage from "../assets/images/home/hero_image.jpg"
import book1 from "../assets/images/home/book1.jpg"
import book2 from "../assets/images/home/book2.jpg"
import book3 from "../assets/images/home/book3.jpg"

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);
    const { orgSettings, isLoading } = useConfig();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Couleurs du thème depuis la configuration
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    if (isLoading) {
        return (
            <div className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-gray-100">
                <div className="animate-pulse text-center">
                    <div className="h-12 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
                    <div className="h-6 w-96 bg-gray-300 rounded mb-8 mx-auto"></div>
                    <div className="flex space-x-4 justify-center">
                        <div className="h-12 w-32 bg-gray-300 rounded"></div>
                        <div className="h-12 w-32 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative min-h-[120vh] flex items-start justify-center overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor}e6 50%, ${primaryColor}b3 100%)`
            }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-96 h-96 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{ backgroundColor: primaryColor }}
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 animate-pulse"
                    style={{ backgroundColor: primaryColor, animationDelay: '2s' }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 w-96 h-96 opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{ backgroundColor: primaryColor, animationDelay: '3s' }}
                ></div>
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-repeat bg-center"></div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 pt-24 md:pt-36">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <div
                            className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6 transform hover:scale-105 transition-transform duration-300"
                        >
              <span className="text-white/90 font-medium text-sm">
                Bienvenue sur {organizationName}
              </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Votre bibliothèque{' '}
                            <span
                                className="animate-pulse"
                                style={{ color: primaryColor }}
                            >
                numérique
              </span>{' '}
                            de nouvelle génération
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0">
                            Découvrez une nouvelle façon d'explorer, de gérer et d'emprunter des livres avec notre système de gestion de bibliothèque moderne et intuitif.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                            <Link
                                to="/catalogue"
                                className="group bg-white text-gray-800 py-3 px-8 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-center"
                                style={{
                                    '--hover-bg': primaryColor,
                                    '--hover-shadow': `${primaryColor}30`
                                } as React.CSSProperties}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = primaryColor;
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.boxShadow = `0 8px 25px -5px ${primaryColor}30`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = '#1f2937';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                Explorer le catalogue
                                <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/auth"
                                className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-center hover:bg-white"
                                style={{
                                    '--hover-text': secondaryColor
                                } as React.CSSProperties}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = secondaryColor;
                                    e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(255, 255, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                Se connecter
                                <LogIn className="h-5 w-5 ml-2" />
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform duration-300 shadow-lg">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <Book className="h-8 w-8" style={{ color: primaryColor }} />
                                    <div>
                                        <div className="font-bold text-2xl md:text-3xl text-white">25K+</div>
                                        <div className="text-white/80 text-sm">Livres disponibles</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform duration-300 shadow-lg">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <Users className="h-8 w-8" style={{ color: primaryColor }} />
                                    <div>
                                        <div className="font-bold text-2xl md:text-3xl text-white">5K+</div>
                                        <div className="text-white/80 text-sm">Membres actifs</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform duration-300 shadow-lg">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <Clock className="h-8 w-8" style={{ color: primaryColor }} />
                                    <div>
                                        <div className="font-bold text-2xl md:text-3xl text-white">24/7</div>
                                        <div className="text-white/80 text-sm">Accès illimité</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
                        <div className="relative">
                            {/* Main book showcase */}
                            <div
                                className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500"
                                style={{ transform: `perspective(1000px) rotateY(${scrollY * 0.02}deg) rotateX(${scrollY * 0.01}deg)` }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/30 backdrop-blur-sm p-3">
                                    {/* Image placeholder with modern design */}
                                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                                        <img
                                            src={heroImage}
                                            alt="Bibliothèque numérique"
                                            className="w-full h-full object-cover rounded-xl"
                                        />

                                        {/* Overlay gradient */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: `linear-gradient(to bottom, ${secondaryColor}30, ${secondaryColor}cc)`
                                            }}
                                        ></div>

                                        {/* Floating book elements */}
                                        <div className="absolute top-1/4 left-1/4 w-20 h-24 bg-white rounded shadow-lg transform -rotate-12 animate-float">
                                            <img src={book1} alt="Book cover" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute top-1/3 right-1/4 w-20 h-24 bg-white rounded shadow-lg transform rotate-6 animate-float" style={{ animationDelay: '1.5s' }}>
                                            <img src={book2} alt="Book cover" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute bottom-1/4 right-1/3 w-20 h-24 bg-white rounded shadow-lg transform -rotate-3 animate-float" style={{ animationDelay: '1s' }}>
                                            <img src={book3} alt="Book cover" className="w-full h-full object-cover" />
                                        </div>

                                        {/* Text overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="text-white text-2xl md:text-3xl font-bold px-6 py-4 rounded-lg backdrop-blur-sm shadow-lg border border-white/10"
                                                style={{ backgroundColor: `${secondaryColor}60` }}
                                            >
                                                Bibliothèque Moderne
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div
                                className="absolute -top-10 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"
                                style={{ backgroundColor: primaryColor }}
                            ></div>
                            <div
                                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                                style={{ backgroundColor: secondaryColor }}
                            ></div>

                            {/* Floating book cards */}
                            <div
                                className="absolute -right-4 top-10 w-36 md:w-48 aspect-[2/3] bg-white rounded-lg shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-300"
                                style={{ transform: `rotate(-6deg) translateY(${scrollY * 0.05}px)` }}
                            >
                                <img src={book1} alt="Featured book" className="w-full h-full object-cover" />
                                <div
                                    className="absolute bottom-0 left-0 right-0 text-white p-2 text-sm font-medium"
                                    style={{ backgroundColor: `${secondaryColor}cc` }}
                                >
                                    Bestseller
                                </div>
                            </div>

                            <div
                                className="absolute -left-4 bottom-10 w-36 md:w-48 aspect-[2/3] bg-white rounded-lg shadow-xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-300"
                                style={{ transform: `rotate(6deg) translateY(${-scrollY * 0.03}px)` }}
                            >
                                <img src={book2} alt="Featured book" className="w-full h-full object-cover" />
                                <div
                                    className="absolute bottom-0 left-0 right-0 text-white p-2 text-sm font-medium"
                                    style={{ backgroundColor: `${primaryColor}cc` }}
                                >
                                    Nouveauté
                                </div>
                            </div>

                            {/* Interactive dots */}
                            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block">
                                <div className="w-2 h-2 bg-white rounded-full mb-3 animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full mb-3 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full mb-3 animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="#ffffff" fillOpacity="1" d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,160C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <a href="#content" className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center cursor-pointer hover:border-white hover:bg-white/10 transition-all">
                    <ChevronDown className="h-6 w-6 text-white" />
                </a>
            </div>
        </div>
    );
};

export default Hero;
