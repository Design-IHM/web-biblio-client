// src/layouts/DashboardLayout.tsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ShoppingCart, 
  MessageCircle, 
  Clock, 
  Bell, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PieChart,
  BarChart4,
  Settings
} from 'lucide-react';

// Définition des variables de couleur
const COLORS = {
  primary: '#ff8c00',    // Orange
  secondary: '#1b263b',  // Dark Blue
  lightText: '#ffffff',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
  activeBg: 'rgba(255, 140, 0, 0.2)'
};

// Interface pour les menus
interface MenuItem {
  path: string;
  name: string;
  icon: JSX.Element;
}

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Détection du mode mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Initialisation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems: MenuItem[] = [
    
    { 
      path: '/dashboard/profile', 
      name: ' Profil', 
      icon: <User size={20} /> 
    },
    { 
      path: '/dashboard/reservations', 
      name: ' Réservations', 
      icon: <Calendar size={20} /> 
    },
    { 
      path: '/dashboard/cart', 
      name: ' Panier', 
      icon: <ShoppingCart size={20} /> 
    },
    { 
      path: '/dashboard/chat', 
      name: 'Chat', 
      icon: <MessageCircle size={20} /> 
    },
    { 
        path: '/dashboard/statistics', 
        name: 'Statistics', 
        icon: <PieChart size={20} /> 
    },
    { 
      path: '/dashboard/history', 
      name: 'Historique', 
      icon: <Clock size={20} /> 
    },
    { 
      path: '/dashboard/notifications', 
      name: 'Notifications', 
      icon: <Bell size={20} /> 
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative h-full transition-all duration-300 z-20 shadow-xl ${
          isMobile && !collapsed ? 'translate-x-0' : isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ 
          width: collapsed ? '80px' : '260px',
          backgroundColor: COLORS.secondary,
        }}
      >
        {/* Logo et bouton de toggle */}
        <div className="relative h-20 flex items-center px-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <BookOpen size={28} color={COLORS.primary} />
              <span className="text-xl font-bold text-white">BiblioENSPY</span>
            </div>
          )}
          {collapsed && (
            <BookOpen size={28} color={COLORS.primary} className="mx-auto" />
          )}
          <button 
            onClick={toggleSidebar}
            className={`absolute ${collapsed ? 'right-0 top-1/2 -translate-y-1/2 -mr-3' : 'right-4 top-1/2 -translate-y-1/2'} 
                      p-1 rounded-full bg-white hover:bg-gray-100 focus:outline-none 
                      shadow-md transition-transform duration-300 z-30`}
            style={{ 
              color: COLORS.primary,
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Profil utilisateur */}
        <div 
          className={`relative px-4 py-5 border-b border-opacity-20`}
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 border-2 border-white">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
                style={{ display: collapsed ? 'none' : 'block' }}
              ></span>
            </div>
            
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <h3 className="text-white font-semibold truncate">BornBeforeDesign</h3>
                <p className="text-gray-300 text-sm truncate">bornbeforedesign@gmail.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path === '/dashboard' && location.pathname === '/dashboard');
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-opacity-20 font-medium' 
                        : 'hover:bg-opacity-10'
                    }`}
                    style={{
                      backgroundColor: isActive ? COLORS.activeBg : 'transparent',
                      color: isActive ? COLORS.primary : COLORS.lightText,
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {item.icon}
                    </div>
                    
                    {!collapsed && (
                      <div className="relative ml-3 whitespace-nowrap">
                        {item.name}
                        {isActive && (
                          <span 
                            className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-100 transition-transform duration-300 origin-left"
                            style={{ backgroundColor: COLORS.primary }}
                          ></span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="absolute bottom-0 w-full border-t border-opacity-20 p-4" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <NavLink
            to="/auth"
            className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-opacity-10"
            style={{
              color: COLORS.lightText,
              backgroundColor: 'transparent',
            }}
          >
            <div className="flex items-center justify-center">
              <LogOut size={20} />
            </div>
            
            {!collapsed && (
              <span className="ml-3 whitespace-nowrap">Se déconnecter</span>
            )}
          </NavLink>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Toggle button for mobile */}
      {isMobile && collapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-lg"
          style={{ color: COLORS.primary }}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Main content */}
      <main 
        className="flex-1 overflow-auto transition-all duration-300 relative"
      >
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;