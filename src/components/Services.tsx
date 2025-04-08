// src/components/Services.jsx
import React from 'react';
import { theme } from '../styles/theme';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Catalogue en ligne",
      description: "Accédez à notre catalogue complet de livres, magazines et ressources numériques.",
      icon: "book",
      link: "/catalogue"
    },
    {
      id: 2,
      title: "Réservation de livres",
      description: "Réservez vos livres en avance et récupérez-les quand vous le souhaitez.",
      icon: "calendar",
      link: "/reservation"
    },
    {
      id: 3,
      title: "Espaces de travail",
      description: "Réservez des salles de travail et des espaces collaboratifs.",
      icon: "desk",
      link: "/espaces"
    },
    {
      id: 4,
      title: "Ressources numériques",
      description: "Accédez à des milliers de livres numériques, articles et cours en ligne.",
      icon: "computer",
      link: "/numerique"
    }
  ];

  // Icon components (simplified)
  const icons = {
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832
         5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168
          5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    desk: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    computer: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Nos Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez tous les services que notre bibliothèque met à votre disposition pour vous offrir une expérience de lecture et d'apprentissage exceptionnelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-primary">
              <div className="text-primary mb-4">
                {icons[service.icon]}
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <a 
                href={service.link} 
                className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors"
              >
                En savoir plus
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="/services" 
            className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-lg font-medium transition-colors"
          >
            Voir tous nos services
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;