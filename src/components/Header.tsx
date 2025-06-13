import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [reservationCount, setReservationCount] = useState(3);
    const { orgSettings, isLoading } = useConfig();

    // Effet pour détecter le défilement
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
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
            <header className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-white text-gray-800 shadow-lg py-2' : 'bg-transparent text-white py-4'
            }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="animate-pulse">
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-white text-gray-800 shadow-lg py-2' : 'bg-transparent text-white py-4'
            }`}
            style={{
                '--primary-color': primaryColor,
                '--secondary-color': secondaryColor
            } as React.CSSProperties}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center space-x-2">
                    {orgSettings?.Logo ? (
                        <img
                            src={orgSettings.Logo}
                            alt={organizationName}
                            className="h-10 w-10 object-contain"
                        />
                    ) : null}
                    <div
                        className={`font-bold text-2xl transition-colors ${
                            scrolled ? 'text-gray-800' : 'text-white'
                        }`}
                        style={{
                            color: scrolled ? primaryColor : undefined
                        }}
                    >
                        {organizationName}
                    </div>
                </NavLink>

                {/* Navigation principale pour desktop */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <NavLink
                        to="/"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Accueil
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        ></span>
                    </NavLink>
                    <NavLink
                        to="/catalogue"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Catalogue
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        ></span>
                    </NavLink>
                    <NavLink
                        to="/aide"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Aide
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        ></span>
                    </NavLink>
                </nav>

                {/* Actions pour desktop */}
                <div className="hidden lg:flex items-center space-x-6">
                    {/* Recherche */}
                    <button
                        className={`p-2 rounded-full transition-all hover:bg-opacity-10 ${
                            scrolled ? 'text-gray-700' : 'text-white'
                        }`}
                        style={{
                            '--hover-bg': secondaryColor
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${secondaryColor}10`;
                            e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = scrolled ? '#374151' : 'white';
                        }}
                    >
                        <Search size={20} />
                    </button>

                    {/* Panier avec badge */}
                    <div className="relative">
                        <NavLink
                            to="/dashboard/cart"
                            className={`p-2 rounded-full transition-all hover:bg-opacity-10 ${
                                scrolled ? 'text-gray-700' : 'text-white'
                            }`}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${secondaryColor}10`;
                                e.currentTarget.style.color = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = scrolled ? '#374151' : 'white';
                            }}
                        >
                            <ShoppingBag size={20} />
                            {reservationCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}
                                >
                  {reservationCount}
                </span>
                            )}
                        </NavLink>
                    </div>

                    {/* Profil utilisateur */}
                    <NavLink
                        to="/dashboard"
                        className={`p-2 rounded-full transition-all hover:bg-opacity-10 ${
                            scrolled ? 'text-gray-700' : 'text-white'
                        }`}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${secondaryColor}10`;
                            e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = scrolled ? '#374151' : 'white';
                        }}
                    >
                        <User size={20} />
                    </NavLink>

                    {/* Bouton Connexion */}
                    <NavLink
                        to="/auth"
                        className="px-5 py-2 rounded-md transition-all duration-300"
                        style={{
                            backgroundColor: scrolled ? secondaryColor : primaryColor,
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = scrolled ? primaryColor : secondaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = scrolled ? secondaryColor : primaryColor;
                        }}
                    >
                        Connexion
                    </NavLink>
                </div>

                {/* Bouton menu mobile */}
                <button
                    className="lg:hidden p-2 rounded-full transition-colors"
                    style={{
                        '--hover-bg': `${secondaryColor}20`
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${secondaryColor}20`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X size={24} className={scrolled ? 'text-gray-800' : 'text-white'} />
                    ) : (
                        <Menu size={24} className={scrolled ? 'text-gray-800' : 'text-white'} />
                    )}
                </button>
            </div>

            {/* Menu mobile */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white text-gray-800 shadow-lg p-4 transition-all duration-300">
                    <nav className="flex flex-col space-y-4 py-2">
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `py-2 px-4 rounded-md transition-colors ${isActive
                                    ? 'font-medium'
                                    : 'hover:bg-gray-100'}`
                            }
                            style={({isActive}) => isActive ? {
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor
                            } : {}}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Accueil
                        </NavLink>
                        <NavLink
                            to="/catalogue"
                            className={({isActive}) =>
                                `py-2 px-4 rounded-md transition-colors ${isActive
                                    ? 'font-medium'
                                    : 'hover:bg-gray-100'}`
                            }
                            style={({isActive}) => isActive ? {
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor
                            } : {}}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Catalogue
                        </NavLink>
                        <NavLink
                            to="/aide"
                            className={({isActive}) =>
                                `py-2 px-4 rounded-md transition-colors ${isActive
                                    ? 'font-medium'
                                    : 'hover:bg-gray-100'}`
                            }
                            style={({isActive}) => isActive ? {
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor
                            } : {}}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Aide
                        </NavLink>

                        <div className="border-t border-gray-200 pt-2">
                            <NavLink
                                to="/dashboard/cart"
                                className={({isActive}) =>
                                    `py-2 px-4 rounded-md transition-colors flex items-center justify-between ${isActive
                                        ? 'font-medium'
                                        : 'hover:bg-gray-100'}`
                                }
                                style={({isActive}) => isActive ? {
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor
                                } : {}}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="flex items-center space-x-3">
                                    <ShoppingBag size={18} />
                                    <span>Réservations</span>
                                </div>
                                {reservationCount > 0 && (
                                    <span
                                        className="text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                    {reservationCount}
                  </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/search"
                                className={({isActive}) =>
                                    `py-2 px-4 rounded-md transition-colors flex items-center space-x-3 ${isActive
                                        ? 'font-medium'
                                        : 'hover:bg-gray-100'}`
                                }
                                style={({isActive}) => isActive ? {
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor
                                } : {}}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Search size={18} />
                                <span>Recherche</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard"
                                className={({isActive}) =>
                                    `py-2 px-4 rounded-md transition-colors flex items-center space-x-3 ${isActive
                                        ? 'font-medium'
                                        : 'hover:bg-gray-100'}`
                                }
                                style={({isActive}) => isActive ? {
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor
                                } : {}}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User size={18} />
                                <span>Mon Compte</span>
                            </NavLink>
                        </div>

                        <NavLink
                            to="/auth"
                            className="mt-2 text-white font-medium py-3 rounded-md text-center transition-colors"
                            style={{
                                backgroundColor: secondaryColor
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = secondaryColor;
                            }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Connexion
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
