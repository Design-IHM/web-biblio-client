import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import des composants séparés
import Hero from '../components/home/Hero.tsx';
import Annonces from '../components/home/Annonces.tsx';
import Services from '../components/home/Services.tsx';
import Partenaires from '../components/home/Partenaires.tsx';
import CallToActionSection from '../components/home/CallToActionSection.tsx';
import StatisticsSection from '../components/home/StatisticsSection.tsx';
import TestimonialsSection from '../components/home/TestimonialsSection.tsx';

// Import des types
import { TestimonialData } from '../components/home/TestimonialCard.tsx';

// Interface pour les données d'annonces
export interface AnnonceData {
    id: number;
    title: string;
    description: string;
    image?: string;
    bgColor?: string;
}

// Interface pour les statistiques
export interface StatisticData {
    number: string;
    text: string;
}

const HomePage: React.FC = () => {
    const { orgSettings, isLoading } = useConfig();

    // Données des témoignages avec typage strict
    const testimonials: TestimonialData[] = [
        {
            name: "Estelle Ndongo",
            role: "Membre depuis 3 ans",
            text: `J'adore le nouveau système en ligne de ${orgSettings?.Name || 'BiblioENSPY'} qui me permet de réserver des livres à l'avance. Le personnel est toujours accueillant et prêt à aider.`,
            rating: 5
        },
        {
            name: "BornBeforeDesign",
            role: "Étudiant",
            text: "Les espaces de travail sont parfaits pour mes révisions. L'accès aux ressources numériques a considérablement facilité mes recherches universitaires.",
            rating: 5
        },
        {
            name: "Bryan Kouassi",
            role: "Parent",
            text: "Les ateliers de lecture pour enfants sont fantastiques ! Mes enfants adorent y participer et ont développé un véritable amour pour la lecture.",
            rating: 5
        },
        {
            name: "Audrey Mbeuyo",
            role: "Retraité",
            text: "La bibliothèque est devenue mon lieu favori. Je participe régulièrement aux clubs de lecture et j'ai rencontré des personnes partageant les mêmes centres d'intérêt.",
            rating: 4
        },
        {
            name: "Nina Ntye",
            role: "Professeur",
            text: "Les ressources pédagogiques disponibles sont exceptionnelles. J'organise souvent des sorties avec mes élèves et ils adorent l'atmosphère.",
            rating: 5
        }
    ];

    // Données statistiques personnalisées
    const statisticsData: StatisticData[] = [
        { number: "25000", text: "Livres disponibles" },
        { number: "5000", text: "Membres actifs" },
        { number: "300", text: "Événements par an" },
        { number: "15", text: "Années d'expérience" }
    ];

    // Affichage du loader global pendant le chargement des configurations
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner
                    size="xl"
                    text="Chargement de la bibliothèque..."
                    fullScreen
                />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    {/* Hero Section */}
                    <Hero />

                    {/* Announcements Carousel */}
                    <Annonces />

                    {/* Services Section */}
                    <Services />

                    {/* Partners Section */}
                    <Partenaires />

                    {/* Call to Action Section */}
                    <CallToActionSection />

                    {/* Statistics Section */}
                    <StatisticsSection statistics={statisticsData} />

                    {/* Testimonials Section */}
                    <TestimonialsSection testimonials={testimonials} />
                </main>
            </div>

            {/* Styles globaux pour les animations et patterns */}
            <style type="text/css">{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
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

        /* Amélioration des performances d'animation */
        .transform {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Responsive optimizations */
        @media (max-width: 640px) {
          .animate-float {
            animation-duration: 4s;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
        </>
    );
};

export default HomePage;
