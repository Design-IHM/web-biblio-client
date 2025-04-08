// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';

import Hero from '../components/Hero';
import Annonces from '../components/Annonces';
import Services from '../components/Services';
import Partenaires from '../components/Partenaires';
import { motion } from 'framer-motion';


// Définition des couleurs
const colors = {
  primary: '#ff8c00',
  secondary: '#1b263b', 
  light: '#ffffff',
  gray: '#f3f4f6',
  darkGray: '#4b5563',
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  },
};
const testimonials = [
  {
    name: "Estelle Ndongo",
    role: "Membre depuis 3 ans",
    text: "J'adore le nouveau système en ligne qui me permet de réserver des livres à l'avance. Le personnel est toujours accueillant et prêt à aider."
  },
  {
    name: "Eléonor Cassin",
    role: "Étudiant",
    text: "Les espaces de travail sont parfaits pour mes révisions. L'accès aux ressources numériques a considérablement facilité mes recherches universitaires."
  },
  {
    name: "Bryan Kouassi",
    role: "Parent",
    text: "Les ateliers de lecture pour enfants sont fantastiques ! Mes enfants adorent y participer et ont développé un véritable amour pour la lecture."
  }
];

// Composant pour les étoiles de notation
const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-primary' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Composant pour les statistiques
const StatItem = ({ number, text, delay }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animation du compteur quand visible
          const num = parseInt(number.replace(/\D/g, ''));
          const duration = 2000; // 2 secondes
          const step = Math.max(1, Math.floor(num / (duration / 16)));
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current > num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 16);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [number]);
  
  return (
    <motion.div 
      ref={ref}
      className="relative p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-t-xl"></div>
      <div className="text-5xl font-bold mb-3" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {count}+
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </motion.div>
  );
};

// Composant Témoignage
const TestimonialCard = ({ name, role, text, image, delay }) => {
  return (
    <motion.div 
      className="flex-shrink-0 w-full md:w-80 lg:w-96 bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-xl border-t-4 border-primary"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-lg text-secondary">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      
      <div className="relative">
        <svg className="absolute top-0 left-0 w-8 h-8 text-primary opacity-10 transform -translate-x-4 -translate-y-4" 
          fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8v8H6v-4c0-2.2 1.8-4 4-4zm12 0v8h-4v-4c0-2.2 1.8-4 4-4z" />
        </svg>
        <p className="text-gray-600 italic leading-relaxed">
          {text}
        </p>
        <svg className="absolute bottom-0 right-0 w-8 h-8 text-primary opacity-10 transform translate-x-2 translate-y-2" 
          fill="currentColor" viewBox="0 0 32 32">
          <path d="M22 24v-8h4v4c0 2.2-1.8 4-4 4zm-12 0v-8h4v4c0 2.2-1.8 4-4 4z" />
        </svg>
      </div>
      
      <div className="mt-6">
        <StarRating rating={5} />
      </div>
    </motion.div>
  );
};

// Section des témoignages
const TestimonialsSection = ({ testimonials }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Gestion du scroll horizontal avec la souris
  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const move = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Vitesse de défilement
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-20 bg-gray relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="text-4xl font-bold mb-4 text-secondary">Ce que disent nos lecteurs</h2>
          <div className="w-24 h-1 mx-auto bg-primary rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Découvrez les expériences partagées par notre communauté de lecteurs et d'apprenants passionnés.
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <button className="p-2 rounded-full bg-white shadow-lg text-secondary hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto py-6 px-4 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            onMouseDown={startDragging}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            onMouseMove={move}
          >
            <TestimonialCard 
              name="Estelle Ndongo"
              role="Membre depuis 3 ans"
              text="J'adore le nouveau système en ligne qui me permet de réserver des livres à l'avance. Le personnel est toujours accueillant et prêt à aider."
              delay={0.1}
            />
            <TestimonialCard 
              name="Eléonor Cassin"
              role="Étudiant"
              text="Les espaces de travail sont parfaits pour mes révisions. L'accès aux ressources numériques a considérablement facilité mes recherches universitaires."
              delay={0.2}
            />
            <TestimonialCard 
              name="Bryan Kouassi"
              role="Parent"
              text="Les ateliers de lecture pour enfants sont fantastiques ! Mes enfants adorent y participer et ont développé un véritable amour pour la lecture."
              delay={0.3}
            />
            <TestimonialCard 
              name="Audrey Mbeuyo"
              role="Retraité"
              text="La bibliothèque est devenue mon lieu favori. Je participe régulièrement aux clubs de lecture et j'ai rencontré des personnes partageant les mêmes centres d'intérêt."
              delay={0.4}
            />
            <TestimonialCard 
              name="Nina Ntye"
              role="Professeur"
              text="Les ressources pédagogiques disponibles sont exceptionnelles. J'organise souvent des sorties avec mes élèves et ils adorent l'atmosphère."
              delay={0.5}
            />
          </div>
          
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <button className="p-2 rounded-full bg-white shadow-lg text-secondary hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-primary"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        </div>
      </div>
    </section>
  );
};

// Section d'appel à l'action
const CallToActionSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ 
        background: `linear-gradient(120deg, ${colors.secondary} 0%, ${colors.primary} 100%)` 
      }}></div>
      
      {/* Forme décorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Rejoignez notre communauté</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Créez un compte aujourd'hui et profitez de tous nos services pour explorer, 
            emprunter et découvrir notre vaste collection.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.a 
              href="/inscription" 
              className="bg-white text-secondary hover:bg-gray-100 py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
              S'inscrire
            </motion.a>
            
            <motion.a 
              href="/catalogue" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-secondary py-4 px-8 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Explorer le catalogue
            </motion.a>
          </div>
          
          <div className="mt-12 pt-12 border-t border-white/20">
            <p className="text-white/80 text-sm mb-4">Rejoignez les milliers de membres qui nous font confiance</p>
            <div className="flex justify-center space-x-8">
              <div className="bg-white/10 py-2 px-4 rounded-lg">
                <span className="text-white text-sm font-medium">Inscription rapide</span>
              </div>
              <div className="bg-white/10 py-2 px-4 rounded-lg">
                <span className="text-white text-sm font-medium">Accès illimité</span>
              </div>
              <div className="bg-white/10 py-2 px-4 rounded-lg">
                <span className="text-white text-sm font-medium">Assistance 7j/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Section des statistiques
const StatisticsSection = () => {
  return (
    <section className="py-20 bg-white relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            Nos chiffres
          </span>
          <h2 className="text-4xl font-bold mb-4 text-secondary">Une bibliothèque en constante évolution</h2>
          <div className="w-24 h-1 mx-auto bg-primary rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Découvrez l'étendue de notre bibliothèque à travers quelques chiffres qui témoignent 
            de notre engagement envers la culture et le savoir.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem number="25000" text="Livres disponibles" delay={0.1} />
          <StatItem number="5000" text="Membres actifs" delay={0.2} />
          <StatItem number="300" text="Événements par an" delay={0.3} />
          <StatItem number="15" text="Années d'expérience" delay={0.4} />
        </div>
        
        <motion.div 
          className="mt-16 bg-gradient-to-r from-secondary/5 to-primary/5 p-8 rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-secondary mb-2">Vous voulez en savoir plus?</h3>
              <p className="text-gray-600">Découvrez notre catalogue complet et toutes nos activités</p>
            </div>
            <motion.a 
              href="/services" 
              className="bg-gradient-to-r from-secondary to-primary text-grey py-3 px-8 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir nos services
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Composant principal

const HomePage = () => {
  // Sample data for the announcements carousel
  const annoncesData = [
    {
      id: 1,
      title: "Nouveaux arrivages",
      description: "Découvrez notre collection de nouveaux livres disponibles dès maintenant dans toutes nos bibliothèques.",
      image: "nouveaux-arrivages.jpg"
    },
    {
      id: 2,
      title: "Événement littéraire",
      description: "Rencontre avec l'auteur Marc Lévy le 15 avril à 18h dans notre bibliothèque centrale.",
      image: "evenement-litteraire.jpg"
    },
    {
      id: 3,
      title: "Promotion d'été",
      description: "50% de réduction sur les abonnements premium pendant tout le mois de juillet.",
      image: "promotion-ete.jpg"
    },
    {
      id: 4,
      title: "Atelier d'écriture",
      description: "Participez à notre atelier d'écriture créative tous les samedis matin de 10h à 12h.",
      image: "atelier-ecriture.jpg"
    }
  ];

  return (
    <>

    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Announcements Carousel */}
        <Annonces annonces={annoncesData} />
        
        {/* Services Section */}
        <Services />
        
        {/* Partners Section */}
        <Partenaires />
        <CallToActionSection />
        <StatisticsSection />
        <TestimonialsSection testimonials={testimonials} />
       
          
      </main>
      
    </div>
    <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </>
  );
};

export default HomePage;