import React, { useState, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import LoadingSpinner from '../common/LoadingSpinner';
import Announce1 from '../../assets/images/home/hero_image.jpg';

interface AnnonceData {
    id: number;
    title: string;
    description: string;
    image: string;
    bgColor: string;
}

interface AnnoncesProps {
    annonces?: AnnonceData[];
}

const Annonces: React.FC<AnnoncesProps> = ({ annonces }) => {
    const { orgSettings, isLoading } = useConfig();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Configuration des couleurs depuis Firebase
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    // Données d'annonces par défaut adaptées à l'organisation
    const defaultAnnonces: AnnonceData[] = [
        {
            id: 1,
            title: "Nouveaux arrivages",
            description: `Découvrez la nouvelle collection de ${organizationName} avec des centaines de livres récemment ajoutés à notre catalogue.`,
            image: Announce1,
            bgColor: `${primaryColor}15` // Teinte légère de la couleur primaire
        },
        {
            id: 2,
            title: "Événement littéraire",
            description: `${organizationName} organise une rencontre exceptionnelle avec des auteurs locaux. Rejoignez-nous pour une soirée littéraire unique.`,
            image: "/images/author-event.jpg",
            bgColor: `${secondaryColor}15` // Teinte légère de la couleur secondaire
        },
        {
            id: 3,
            title: "Services numériques",
            description: `Profitez de nos nouveaux services numériques : consultation en ligne, réservation à distance et accès aux ressources 24h/24.`,
            image: "/images/digital-services.jpg",
            bgColor: `${primaryColor}20`
        },
        {
            id: 4,
            title: "Horaires étendus",
            description: `${organizationName} étend ses horaires d'ouverture pour mieux vous servir. Consultez nos nouveaux créneaux disponibles.`,
            image: "/images/extended-hours.jpg",
            bgColor: `${secondaryColor}20`
        }
    ];

    const data = annonces || defaultAnnonces;

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === data.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [data.length]);

    // Affichage du loader pendant le chargement
    if (isLoading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 flex justify-center">
                    <LoadingSpinner size="lg" text="Chargement des actualités..." />
                </div>
            </section>
        );
    }

    return (
        <div className="w-full py-8 px-4 bg-white shadow-lg rounded-lg">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    {/* Élément décoratif */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-1 rounded-full"
                            style={{
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                            }}
                        ></div>
                    </div>

                    <h2
                        className="text-2xl font-bold mb-2"
                        style={{ color: secondaryColor }}
                    >
                        Actualités de {organizationName}
                    </h2>
                    <p className="text-gray-600">
                        Restez informé de nos dernières nouveautés et événements
                    </p>
                </div>

                {/* Container du carousel */}
                <div className="relative">
                    {/* Navigation - Précédent */}
                    <button
                        onClick={() =>
                            setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1)}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                            color: secondaryColor,
                            boxShadow: `0 4px 12px ${secondaryColor}20`
                        }}
                        aria-label="Annonce précédente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Slides du carousel */}
                    <div className="overflow-hidden relative rounded-xl shadow-xl" style={{ minHeight: "320px" }}>
                        {data.map((annonce, index) => (
                            <div
                                key={annonce.id}
                                className={`absolute w-full transition-all duration-700 ease-in-out flex flex-col md:flex-row ${
                                    index === currentIndex ? 'opacity-100 translate-x-0 z-10' :
                                        index < currentIndex ? 'opacity-0 -translate-x-full z-0' : 'opacity-0 translate-x-full z-0'
                                }`}
                                style={{ backgroundColor: annonce.bgColor }}
                            >
                                <div className="md:w-1/2 h-74 md:h-auto overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <img
                                            src={annonce.image || Announce1}
                                            alt={annonce.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        {/* Overlay gradient */}
                                        <div
                                            className="absolute inset-0 opacity-30 transition-opacity duration-300 hover:opacity-40"
                                            style={{
                                                background: `linear-gradient(45deg, ${secondaryColor}60, ${primaryColor}40)`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 self-start"
                                        style={{
                                            backgroundColor: primaryColor,
                                            color: 'white'
                                        }}
                                    >
                                        {organizationName}
                                    </div>

                                    <h3
                                        className="text-xl md:text-2xl font-semibold mb-3"
                                        style={{ color: secondaryColor }}
                                    >
                                        {annonce.title}
                                    </h3>

                                    <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                                        {annonce.description}
                                    </p>

                                    <a
                                        href="#"
                                        className="mt-auto self-start px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center group"
                                        style={{
                                            backgroundColor: primaryColor,
                                            color: "white",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = secondaryColor;
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = primaryColor;
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        En savoir plus
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation - Suivant */}
                    <button
                        onClick={() =>
                            setCurrentIndex(currentIndex === data.length - 1 ? 0 : currentIndex + 1)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                            color: secondaryColor,
                            boxShadow: `0 4px 12px ${secondaryColor}20`
                        }}
                        aria-label="Annonce suivante"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicateurs du carousel */}
                <div className="flex justify-center mt-6 space-x-2">
                    {data.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300`}
                            style={{
                                backgroundColor: index === currentIndex ? primaryColor : '#d1d5db',
                                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
                            }}
                            aria-label={`Aller à l'annonce ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Call to action en bas */}
                <div className="mt-8 text-center">
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Suivez-nous pour plus d'actualités
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Annonces;
