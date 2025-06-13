// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import { authService } from '../../services/auth/authService';
import { BiblioUser } from '../../types/auth';

import {
    Search,
    ShoppingBag,
    User,
    Menu,
    X,
    LogOut,
    Settings,
    BookOpen,
    Bell
} from 'lucide-react';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { orgSettings, isLoading } = useConfig();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [reservationCount, setReservationCount] = useState(3);
    const [currentUser, setCurrentUser] = useState<BiblioUser | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Configuration depuis Firebase
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    // Effet pour détecter le défilement
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effet pour surveiller l'état d'authentification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user && user.emailVerified) {
                try {
                    const biblioUser = await authService.getCurrentUser();
                    setCurrentUser(biblioUser);
                } catch (error) {
                    console.error('Erreur récupération utilisateur:', error);
                }
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Gestion de la déconnexion
    const handleLogout = async () => {
        try {
            await authService.signOut();
            setCurrentUser(null);
            setFirebaseUser(null);
            setShowUserMenu(false);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erreur déconnexion:', error);
        }
    };

    // Fermer le menu utilisateur quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = () => {
            setShowUserMenu(false);
        };

        if (showUserMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showUserMenu]);

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
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center space-x-2">
                    {orgSettings?.Logo && (
                        <img
                            src={orgSettings.Logo}
                            alt={organizationName}
                            className="h-10 w-10 object-contain"
                        />
                    )}
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
              relative transition-all duration-200 py-2 px-1 group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Accueil
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </NavLink>

                    <NavLink
                        to="/Books"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1 group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Livres
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </NavLink>

                    <NavLink
                        to="/Thesis"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1 group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Memoires
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </NavLink>

                    <NavLink
                        to="/aide"
                        className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1 group
              ${isActive ? '' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
                        style={({isActive}) => isActive ? { color: primaryColor } : {}}
                    >
                        Aide
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </NavLink>
                </nav>

                {/* Actions pour desktop */}
                <div className="hidden lg:flex items-center space-x-4">
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
                    {currentUser && (
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
                    )}

                    {/* Profil utilisateur ou bouton connexion */}
                    {currentUser ? (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserMenu(!showUserMenu);
                                }}
                                className="flex items-center space-x-2 p-2 rounded-full transition-all hover:bg-opacity-10"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = `${secondaryColor}10`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {currentUser.profilePicture ? (
                                    <img
                                        src={currentUser.profilePicture}
                                        alt={currentUser.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                    />
                                ) : (
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className={`hidden md:block ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  {currentUser.name.split(' ')[0]}
                </span>
                            </button>

                            {/* Menu déroulant utilisateur */}
                            {showUserMenu && (
                                <div
                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2 z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Info utilisateur */}
                                    <div className="px-4 py-3 border-b">
                                        <div className="flex items-center space-x-3">
                                            {currentUser.profilePicture ? (
                                                <img
                                                    src={currentUser.profilePicture}
                                                    alt={currentUser.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    {currentUser.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800">{currentUser.name}</p>
                                                <p className="text-sm text-gray-500">{currentUser.email}</p>
                                                <p className="text-xs" style={{ color: primaryColor }}>
                                                    {currentUser.statut === 'etudiant' ? 'Étudiant' : 'Enseignant'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1">
                                        <NavLink
                                            to="/dashboard"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="h-4 w-4 mr-3" />
                                            Mon Dashboard
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/profile"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="h-4 w-4 mr-3" />
                                            Paramètres
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/emprunts"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <BookOpen className="h-4 w-4 mr-3" />
                                            Mes Emprunts
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/notifications"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Bell className="h-4 w-4 mr-3" />
                                            Notifications
                                        </NavLink>
                                    </div>

                                    {/* Déconnexion */}
                                    <div className="border-t pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/auth"
                            className="px-5 py-2 rounded-md transition-all duration-300 text-white font-medium"
                            style={{
                                backgroundColor: scrolled ? secondaryColor : primaryColor
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
                    )}
                </div>

                {/* Bouton menu mobile */}
                <button
                    className="lg:hidden p-2 rounded-full transition-colors"
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
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white text-gray-800 shadow-lg">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
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
                                to="/books"
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
                                Livres
                            </NavLink>

                            <NavLink
                                to="/Thesis"
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
                                Memoire
                            </NavLink>

                            <NavLink
                                to="/help"
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
                                aide
                            </NavLink>

                            {currentUser ? (
                                <>
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
                                        <span>Mon Dashboard</span>
                                    </NavLink>

                                    <button
                                        onClick={handleLogout}
                                        className="py-2 px-4 rounded-md transition-colors flex items-center space-x-3 hover:bg-red-50 text-red-600 text-left"
                                    >
                                        <LogOut size={18} />
                                        <span>Se déconnecter</span>
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/auth"
                                    className="mt-2 text-white font-medium py-3 rounded-md text-center transition-colors"
                                    style={{ backgroundColor: secondaryColor }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Connexion
                                </NavLink>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
