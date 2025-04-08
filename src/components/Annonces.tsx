// src/components/Annonces.jsx
import React, { useState, useEffect } from 'react';
import Announce1 from '../assets/images/home/hero_image.jpg';

const Annonces = ({ annonces }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === annonces.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [annonces.length]);
  
  // Sample announcements data (will be passed as props)
  const sampleAnnonces = [
    {
      id: 1,
      title: "Nouveaux arrivages",
      description: "Découvrez notre collection de nouveaux livres",
      image: {Announce1},
      bgColor: "#ffecd9" // Teinte légère de orange primary
    },
    {
      id: 2,
      title: "Événement littéraire",
      description: "Rencontre avec l'auteur le 15 avril",
      image: "/images/author-event.jpg",
      bgColor: "#e6eeff" // Teinte légère de bleu secondary
    },
    {
      id: 3,
      title: "Promotion d'été",
      description: "50% de réduction sur les abonnements premium",
      image: "/images/summer-promo.jpg",
      bgColor: "#fff5e6" // Une autre teinte légère de orange
    }
  ];
  
  const data = annonces || sampleAnnonces;
  
  return (
    <div className="w-full py-8 px-4 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#1b263b" }}>
          Actualités et Annonces
        </h2>
        
        {/* Carousel container */}
        <div className="relative">
          {/* Carousel navigation - Previous */}
          <button 
            onClick={() => 
              setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            style={{ backgroundColor: "#ffffff", color: "#1b263b" }}
            aria-label="Annonce précédente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Carousel slides */}
          <div className="overflow-hidden relative rounded-xl shadow-xl" style={{ minHeight: "320px" }}>
            {data.map((annonce, index) => (
              <div 
                key={annonce.id}
                className={`absolute w-full transition-opacity duration-500 ease-in-out flex flex-col md:flex-row ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{ backgroundColor: annonce.bgColor }}
              >
                <div className="md:w-1/2 h-74 md:h-auto overflow-hidden">
                  {/* Image placeholder with color overlay */}
                  <div className="relative w-full h-full">
                    <img 
                      src={Announce1} 
                      alt={annonce.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-orange-500 hover:to-transparent opacity-30 transition-all duration-300"></div>
                  </div>
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: "#ff8c00" }}>
                    {annonce.title}
                  </h3>
                  <p className="text-gray-700 mb-6 text-base md:text-lg">
                    {annonce.description}
                  </p>
                  <a 
                    href="#" 
                    className="mt-auto self-start px-6 py-1 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: "#ff8c00", 
                      color: "white",
                      border: "2px solid #ff8c00",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "#ff8c00";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff8c00";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    En savoir plus
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel navigation - Next */}
          <button 
            onClick={() => 
              setCurrentIndex(currentIndex === data.length - 1 ? 0 : currentIndex + 1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            style={{ backgroundColor: "#ffffff", color: "#1b263b" }}
            aria-label="Annonce suivante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-4">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1 w-3 h-3 rounded-full transition-colors duration-300`}
              style={{ 
                backgroundColor: index === currentIndex ? '#ff8c00' : '#d1d5db',
                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.3s ease, background-color 0.3s ease'
              }}
              aria-label={`Aller à l'annonce ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Annonces;