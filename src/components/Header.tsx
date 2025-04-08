import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reservationCount, setReservationCount] = useState(3); // Exemple: 3 réservations
  
  // Effet pour détecter le défilement et changer l'apparence du header
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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white text-gray-800 shadow-lg py-2' : 'bg-transparent text-white py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <div className={`font-bold text-2xl transition-colors ${
            scrolled ? 'text-[#ff8c00]' : 'text-white'
          }`}>
            BiblioENSPY
          </div>
        </NavLink>
        
        {/* Navigation principale pour desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              hover:text-[#ff8c00] group
              ${isActive ? 'text-[#ff8c00]' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
          >
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff8c00] transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
          <NavLink 
            to="/bibliotheque" 
            className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              hover:text-[#ff8c00] group
              ${isActive ? 'text-[#ff8c00]' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
          >
            Bibliothèque
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff8c00] transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
          <NavLink 
            to="/aide" 
            className={({isActive}) => `
              relative transition-all duration-200 py-2 px-1
              hover:text-[#ff8c00] group
              ${isActive ? 'text-[#ff8c00]' : scrolled ? 'text-gray-700' : 'text-white'}
            `}
          >
            Aide
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff8c00] transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
        </nav>
        
        {/* Actions pour desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Recherche */}
          <button className={`p-2 rounded-full transition-all hover:bg-opacity-10 hover:bg-[#1b263b] ${
            scrolled ? 'text-gray-700 hover:text-[#ff8c00]' : 'text-white hover:text-[#ff8c00]'
          }`}>
            <Search size={20} />
          </button>
          
          {/* Panier avec badge */}
          <div className="relative">
            <NavLink 
              to="/reservations" 
              className={`p-2 rounded-full transition-all hover:bg-opacity-10 hover:bg-[#1b263b] ${
                scrolled ? 'text-gray-700 hover:text-[#ff8c00]' : 'text-white hover:text-[#ff8c00]'
              }`}
            >
              <ShoppingBag size={20} />
              {reservationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff8c00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {reservationCount}
                </span>
              )}
            </NavLink>
          </div>
          
          {/* Profil utilisateur */}
          <NavLink 
            to="/dashboard" 
            className={`p-2 rounded-full transition-all hover:bg-opacity-10 hover:bg-[#1b263b] ${
              scrolled ? 'text-gray-700 hover:text-[#ff8c00]' : 'text-white hover:text-[#ff8c00]'
            }`}
          >
            <User size={20} />
          </NavLink>
          
          {/* Bouton Connexion */}
          <NavLink 
            to="/auth"
            className={`
              px-5 py-2 rounded-md transition-all duration-300
              ${scrolled 
                ? 'bg-[#1b263b] text-white hover:bg-[#ff8c00]' 
                : 'bg-[#ff8c00] text-white hover:bg-[#1b263b]'}
            `}
          >
            Connexion
          </NavLink>
        </div>
        
        {/* Bouton menu mobile */}
        <button 
          className="lg:hidden p-2 rounded-full transition-colors hover:bg-[#1b263b] hover:bg-opacity-20"
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
                  ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                  : 'hover:bg-gray-100'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/bibliotheque" 
              className={({isActive}) => 
                `py-2 px-4 rounded-md transition-colors ${isActive 
                  ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                  : 'hover:bg-gray-100'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Bibliothèque
            </NavLink>
            <NavLink 
              to="/aide" 
              className={({isActive}) => 
                `py-2 px-4 rounded-md transition-colors ${isActive 
                  ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                  : 'hover:bg-gray-100'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Aide
            </NavLink>
            
            <div className="border-t border-gray-200 pt-2">
              <NavLink 
                to="/reservations" 
                className={({isActive}) => 
                  `py-2 px-4 rounded-md transition-colors flex items-center justify-between ${isActive 
                    ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                    : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag size={18} />
                  <span>Réservations</span>
                </div>
                {reservationCount > 0 && (
                  <span className="bg-[#ff8c00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {reservationCount}
                  </span>
                )}
              </NavLink>
              
              <NavLink 
                to="/search" 
                className={({isActive}) => 
                  `py-2 px-4 rounded-md transition-colors flex items-center space-x-3 ${isActive 
                    ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                    : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={18} />
                <span>Recherche</span>
              </NavLink>
              
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  `py-2 px-4 rounded-md transition-colors flex items-center space-x-3 ${isActive 
                    ? 'bg-orange-100 text-[#ff8c00] font-medium' 
                    : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} />
                <span>Mon Compte</span>
              </NavLink>
            </div>
            
            <NavLink 
              to="/auth"
              className="mt-2 bg-[#1b263b] text-white font-medium py-3 rounded-md text-center hover:bg-[#ff8c00] transition-colors"
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