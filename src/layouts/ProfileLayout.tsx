// src/layouts/ProfileLayout.tsx
import {useState, useEffect, JSX} from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
    User,
    Calendar,
    MessageCircle,
    Clock,
    Bell,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Home,
    Settings,
    Menu,
    X, Book
} from 'lucide-react';
import { authService } from '../services/auth/authService';
import { BiblioUser } from '../types/auth';
import { useConfig } from '../contexts/ConfigContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Interface pour les menus
interface MenuItem {
    path: string;
    name: string;
    icon: JSX.Element;
    badge?: number;
}

const ProfileLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<BiblioUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { orgSettings } = useConfig();

    // Configuration des couleurs dynamiques
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    // Helper function to darken color
    const darkenColor = (color: string, percent: number = 20) => {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const primaryColorDark = darkenColor(primaryColor);

    // Récupération des données utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Détection du mode mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await authService.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const menuItems: MenuItem[] = [
        {
            path: '/profile',
            name: 'Profil',
            icon: <User size={20} />
        },
        {
            path: '/profile/reservations',
            name: 'Reservation',
            icon: <Book size={20} />,
            badge: getReservationCount()
        },
        {
            path: '/profile/emprunts',
            name: 'Emprunts',
            icon: <Calendar size={20} />,
            badge: getEmpruntCount()
        },
        {
            path: '/profile/chat',
            name: 'Chat',
            icon: <MessageCircle size={20} />
        },
        {
            path: '/profile/consultations',
            name: 'Consultations',
            icon: <Clock size={20} />
        },
        {
            path: '/profile/notifications',
            name: 'Notifications',
            icon: <Bell size={20} />,
            badge: user?.notifications?.filter(n => !n.read).length || 0
        }
    ];

    // Fonction pour calculer le nombre de réservations
    function getReservationCount(): number {
        if (!user || !orgSettings) return 0;

        let reservationCount = 0;
        const maxLoans = orgSettings.MaximumSimultaneousLoans || 5;

        for (let i = 1; i <= maxLoans; i++) {
            const etatKey = `etat${i}` as keyof BiblioUser;
            if (user[etatKey] === 'reserv') {
                reservationCount++;
            }
        }

        return reservationCount;
    }

    // Fonction pour calculer le nombre d'emprunts
    function getEmpruntCount(): number {
        if (!user || !orgSettings) return 0;

        let empruntCount = 0;
        const maxLoans = orgSettings.MaximumSimultaneousLoans || 5;

        for (let i = 1; i <= maxLoans; i++) {
            const etatKey = `etat${i}` as keyof BiblioUser;
            if (user[etatKey] === 'emprunt') {
                empruntCount++;
            }
        }

        return empruntCount;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <LoadingSpinner size="lg" text="Chargement..." />
            </div>
        );
    }

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/profile') return 'Profil';
        if (path.includes('emprunts')) return 'Emprunts';
        if (path.includes('reservations')) return 'Reservations';
        if (path.includes('chat')) return 'Chat';
        if (path.includes('consultations')) return 'Consultations';
        if (path.includes('notifications')) return 'Notifications';
        return 'Profil';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Overlay pour mobile */}
            {isMobile && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative h-full transition-all duration-300 z-50 ${
                    isMobile
                        ? mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        : collapsed ? 'w-20' : 'w-80'
                } ${isMobile ? 'w-80' : ''}`}
                style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${darkenColor(secondaryColor, 10)})`
                }}
            >
                {/* En-tête de la sidebar */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        {(!collapsed || isMobile) && (
                            <Link
                                to="/"
                                className="flex items-center space-x-3 cursor-pointer group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-bold text-lg tracking-wide">
                  {orgSettings?.Name || 'BiblioENSPY'}
                </span>
                            </Link>
                        )}

                        <button
                            onClick={isMobile ? toggleMobileMenu : toggleSidebar}
                            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            {isMobile ? <X size={20} /> : collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>
                </div>

                {/* Profil utilisateur */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>

                        {(!collapsed || isMobile) && (
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate text-sm">
                                    {user?.name || 'Utilisateur'}
                                </h3>
                                <p className="text-gray-300 text-xs truncate">
                                    {user?.email || 'email@example.com'}
                                </p>
                                <div className="flex items-center mt-1">
                  <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor
                      }}
                  >
                    {user?.statut === 'etudiant' ? 'Étudiant' : 'Enseignant'}
                  </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation menu */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path === '/profile' && location.pathname === '/profile');

                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden cursor-pointer ${
                                            isActive
                                                ? 'font-semibold shadow-lg transform scale-105'
                                                : 'hover:bg-white/10 hover:transform hover:scale-105'
                                        }`}
                                        style={{
                                            background: isActive
                                                ? `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`
                                                : 'transparent',
                                            color: isActive ? '#ffffff' : '#e2e8f0'
                                        }}
                                        onClick={() => isMobile && setMobileMenuOpen(false)}
                                    >
                                        {/* Icône */}
                                        <div className="flex-shrink-0">
                                            {item.icon}
                                        </div>

                                        {/* Nom du menu */}
                                        {(!collapsed || isMobile) && (
                                            <>
                                                <span className="ml-3 font-medium">{item.name}</span>

                                                {/* Badge pour les notifications */}
                                                {item.badge && item.badge > 0 && (
                                                    <span
                                                        className="ml-auto px-2 py-1 text-xs font-bold rounded-full"
                                                        style={{
                                                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : primaryColor,
                                                            color: isActive ? '#ffffff' : '#ffffff'
                                                        }}
                                                    >
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                                                )}
                                            </>
                                        )}

                                        {/* Indicateur pour mode collapsed */}
                                        {collapsed && !isMobile && item.badge && item.badge > 0 && (
                                            <div
                                                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                                                style={{ backgroundColor: primaryColor }}
                                            />
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bouton de déconnexion - fixé en bas */}
                <div className="p-3 border-t mt-72 border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-300 cursor-pointer group ${
                            collapsed && !isMobile ? 'justify-center' : ''
                        }`}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {(!collapsed || isMobile) && (
                            <span className="ml-3 font-medium">Se déconnecter</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* En-tête */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {isMobile && (
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <Menu size={20} />
                                </button>
                            )}

                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                                    {getPageTitle()}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Bienvenue, {user?.name?.split(' ')[0] || 'Utilisateur'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                style={{ color: primaryColor }}
                            >
                                <Bell size={20} />
                                {(user?.notifications ?? []).filter(n => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                style={{ color: primaryColor }}
                            >
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Zone de contenu avec défilement */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileLayout;
