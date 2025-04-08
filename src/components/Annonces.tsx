// src/components/Annonces.jsx
import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

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
      image: "placeholder1.jpg"
    },
    {
      id: 2,
      title: "Événement littéraire",
      description: "Rencontre avec l'auteur le 15 avril",
      image: "placeholder2.jpg"
    },
    {
      id: 3,
      title: "Promotion d'été",
      description: "50% de réduction sur les abonnements premium",
      image: "placeholder3.jpg"
    }
  ];
  
  const data = annonces || sampleAnnonces;
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
          Actualités et Annonces
        </h2>
        
        {/* Carousel container */}
        <div className="relative">
          {/* Carousel navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button 
              onClick={() => setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1)}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 text-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {data.map((annonce) => (
                <div key={annonce.id} className="min-w-full p-4">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-2/5 bg-gray-200 h-64 md:h-auto">
                      {/* Image placeholder */}
                      <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                        <p className="text-secondary">Image: {annonce.image}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-3/5 p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-primary mb-3">{annonce.title}</h3>
                      <p className="text-gray-700 mb-6">{annonce.description}</p>
                      <button className="inline-flex items-center text-secondary font-medium hover:text-primary transition-colors">
                        En savoir plus
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel navigation */}
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button 
              onClick={() => setCurrentIndex(currentIndex === data.length - 1 ? 0 : currentIndex + 1)}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 text-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-6">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1 w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Aller à l'annonce ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Annonces;