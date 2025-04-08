import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#ff8c00] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold flex items-center">
          <span>BiblioÉtudiant</span>
        </NavLink>
        
        {/* Menu hamburger pour mobile */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Navigation pour desktop */}
        <nav className="hidden md:flex space-x-6">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Accueil
          </NavLink>
          <NavLink 
            to="/books" 
            className={({isActive}) => 
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Livres
          </NavLink>
          <NavLink 
            to="/reservations" 
            className={({isActive}) => 
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Réservations
          </NavLink>
          <NavLink 
            to="/borrowings" 
            className={({isActive}) => 
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Emprunts
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({isActive}) => 
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Profil
          </NavLink>
          <NavLink 
            to="/login"
            className="bg-white text-orange-500 px-4 py-2 rounded-md hover:bg-orange-100"
          >
            Connexion
          </NavLink>
        </nav>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-600 pb-4 px-4">
          <nav className="flex flex-col space-y-3">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                isActive ? "font-bold" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/books" 
              className={({isActive}) => 
                isActive ? "font-bold" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Livres
            </NavLink>
            <NavLink 
              to="/reservations" 
              className={({isActive}) => 
                isActive ? "font-bold" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Réservations
            </NavLink>
            <NavLink 
              to="/borrowings" 
              className={({isActive}) => 
                isActive ? "font-bold" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Emprunts
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({isActive}) => 
                isActive ? "font-bold" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Profil
            </NavLink>
            <NavLink 
              to="/login"
              className="bg-white text-orange-500 px-4 py-2 rounded-md text-center"
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