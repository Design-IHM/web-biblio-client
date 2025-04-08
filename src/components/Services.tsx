// src/components/Services.jsx
import React, { useState } from 'react';
import { theme } from '../styles/theme';

const Services = () => {
  // État pour le suivi de l'élément survolé
  const [hoveredId, setHoveredId] = useState(null);
  
  const services = [
    {
      id: 1,
      title: "Catalogue en ligne",
      description: "Accédez à notre catalogue complet de livres, magazines et ressources numériques.",
      icon: "book",
      link: "/catalogue",
      bgImage: "/images/pattern-catalog.jpg",
      color: "#ff8c00" // Primary color
    },
    {
      id: 2,
      title: "Réservation de livres",
      description: "Réservez vos livres en avance et récupérez-les quand vous le souhaitez.",
      icon: "calendar",
      link: "/reservation",
      bgImage: "/images/pattern-reservation.jpg",
      color: "#ff9d33" // Slightly lighter primary
    },
    {
      id: 3,
      title: "Espaces de travail",
      description: "Réservez des salles de travail et des espaces collaboratifs.",
      icon: "desk",
      link: "/espaces",
      bgImage: "/images/pattern-workspace.jpg",
      color: "#1b263b" // Secondary color
    },
    {
      id: 4,
      title: "Ressources numériques",
      description: "Accédez à des milliers de livres numériques, articles et cours en ligne.",
      icon: "computer",
      link: "/numerique",
      bgImage: "/images/pattern-digital.jpg",
      color: "#2d3b50" // Slightly lighter secondary
    }
  ];

  // Icon components with dynamic color support
  const renderIcon = (iconName, color) => {
    const icons = {
      book: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={color} style={{ transition: "all 0.3s ease" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      calendar: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={color} style={{ transition: "all 0.3s ease" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      desk: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={color} style={{ transition: "all 0.3s ease" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      computer: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={color} style={{ transition: "all 0.3s ease" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    };
    
    return icons[iconName] || null;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div 
        className="absolute inset-0 opacity-5 z-0" 
        style={{
          backgroundImage: "url('/images/library-pattern.png')",
          backgroundSize: "200px",
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          {/* Decorative elements */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-blue-800"></div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#1b263b" }}>
            Nos Services
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez tous les services que notre bibliothèque met à votre disposition pour vous offrir une expérience de lecture et d'apprentissage exceptionnelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              style={{ 
                transform: hoveredId === service.id ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'transform 0.3s ease-out',
                borderTop: `4px solid ${service.color}`
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background image with overlay */}
              <div className="relative h-40 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `url(${service.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                
                {/* Icon container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="p-4 rounded-full bg-white shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      boxShadow: `0 10px 25px -5px ${service.color}40`
                    }}
                  >
                    {renderIcon(service.icon, service.color)}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 
                  className="text-xl font-bold mb-4 group-hover:translate-x-1 transition-transform duration-300"
                  style={{ color: service.color }}
                >
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <a 
                  href={service.link} 
                  className="inline-flex items-center font-medium transition-all duration-300 relative"
                  style={{ 
                    color: service.color,
                    paddingBottom: '2px'
                  }}
                >
                  <span className="relative z-10">En savoir plus</span>
                  
                  {/* Animated underline */}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: service.color }}
                  ></span>
                  
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <a 
            href="/services" 
            className="inline-flex items-center py-4 px-10 rounded-full text-white font-medium shadow-lg transition-all duration-300 relative overflow-hidden group"
            style={{ 
              backgroundColor: "#1b263b",
              boxShadow: "0 10px 30px -5px rgba(27, 38, 59, 0.5)"
            }}
          >
            {/* Button background animation */}
            <span 
              className="absolute inset-0 w-0 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-500"
            ></span>
            
            <span className="relative z-10">Voir tous nos services</span>
            
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;