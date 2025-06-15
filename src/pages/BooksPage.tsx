import React, { useState, useCallback } from 'react';
import { useConfig } from '../contexts/ConfigContext';

// Import de VOS composants existants
import DepartmentFilter from '../components/common/DepartmentFilter.tsx';
import AdvancedSearchBar from '../components/books/AdvancedSearchBar';
import BooksSortOptions, { SortOption, ViewMode } from '../components/books/BooksSortOptions';

import BooksList from '../components/books/BooksList';
import Header from "../components/layout/Header.tsx";
import Footer from "../components/layout/Footer.tsx";
import {MessageCircle} from "lucide-react";
import LibraryStatistics from "../components/books/LibraryStatistics.tsx";

interface SearchFilters {
    query: string;
    author: string;
    publisher: string;
    category: string;
    yearFrom: string;
    yearTo: string;
}

const BooksPage: React.FC = () => {
    const { orgSettings } = useConfig();

    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        query: '',
        author: '',
        publisher: '',
        category: '',
        yearFrom: '',
        yearTo: ''
    });

    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>('title-asc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);

    // Configuration des couleurs
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    // Handlers pour les composants existants
    const handleSearchChange = useCallback((filters: SearchFilters) => {
        setSearchFilters(filters);
    }, []);

    const handleDepartmentChange = useCallback((departments: string[]) => {
        setSelectedDepartments(departments);
    }, []);

    const handleSortChange = useCallback((sort: SortOption) => {
        setSortOption(sort);
    }, []);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    const handleBookReserve = useCallback(async (bookId: string) => {
        try {
            console.log('📚 Réservation du livre:', bookId);
            // TODO: Implémenter la logique de réservation avec votre service
            // await reservationService.reserveBook(bookId);

            // Simuler un délai
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Livre réservé avec succès !');
        } catch {
            alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
    }, []);

    // Gestion des favoris
    const handleToggleFavorite = useCallback((bookId: string) => {
        setFavoriteBooks(prev => {
            const newFavorites = prev.includes(bookId)
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId];

            return newFavorites;
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* En-tête avec hero section */}
            <div className="border bg-[#1b263b] border-gray-200 shadow-sm"
            >
                <div className="container mx-auto px-4 py-12">
                    {/* Titre principal */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4 mt-12">
                            <div
                                className="w-16 h-1 rounded-full"
                                style={{
                                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                }}
                            />
                        </div>
                        <h1
                            className="text-4xl md:text-5xl font-bold mb-4"
                            style={{ color: primaryColor }}
                        >
                            Livres {organizationName}
                        </h1>
                        <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed">
                            Explorez notre collection complète de livres, mémoires et ressources académiques.
                            Recherchez, filtrez et découvrez les ouvrages qui enrichiront vos connaissances.
                        </p>
                    </div>

                    {/* Barre de recherche avancée - VOTRE COMPOSANT */}
                    <div className="max-w-4xl mx-auto">
                        <AdvancedSearchBar
                            onSearchChange={handleSearchChange}
                            placeholder="Rechercher par titre, auteur, éditeur ou mot-clé..."
                        />
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Sidebar avec filtres */}
                    <aside className="xl:col-span-1 space-y-6">
                        {/* Filtre par département - VOTRE COMPOSANT CORRIGÉ */}
                        <DepartmentFilter
                            selectedDepartments={selectedDepartments}
                            onDepartmentChange={handleDepartmentChange}
                        />

                        {/* Informations utiles */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center mb-4">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        style={{ color: primaryColor }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-800">Conseils de recherche</h3>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-3">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 mr-3 flex-shrink-0" />
                                    <span>Utilisez des <strong>mots-clés précis</strong> pour des résultats pertinents</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-3 flex-shrink-0" />
                                    <span>Combinez <strong>plusieurs filtres</strong> pour affiner votre recherche</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 mr-3 flex-shrink-0" />
                                    <span>Explorez les <strong>départements</strong> pour découvrir de nouveaux domaines</span>
                                </li>
                            </ul>
                        </div>

                        <LibraryStatistics
                            className="mb-8"
                            showRefreshButton={true}
                            compact={true}
                        />
                    </aside>

                    {/* Contenu principal */}
                    <main className="xl:col-span-3 space-y-6">
                        {/* Options de tri et d'affichage - VOTRE COMPOSANT */}
                        <BooksSortOptions
                            currentSort={sortOption}
                            onSortChange={handleSortChange}
                            viewMode={viewMode}
                            onViewModeChange={handleViewModeChange}
                        />

                        {/* Liste des livres - NOUVEAU COMPOSANT avec son propre loading */}
                        <BooksList
                            searchFilters={searchFilters}
                            selectedDepartments={selectedDepartments}
                            sortOption={sortOption}
                            viewMode={viewMode}
                            onBookReserve={handleBookReserve}
                            onToggleFavorite={handleToggleFavorite}
                            favoriteBooks={favoriteBooks}
                        />
                    </main>
                </div>
            </div>

            {/* Section d'aide */}
            <div className="bg-white border-t border-gray-200 mt-16">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Besoin d'aide pour votre recherche ?
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Notre équipe de bibliothécaires est là pour vous accompagner dans vos recherches
                            et vous aider à trouver les ressources les plus adaptées à vos besoins.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="inline-flex cursor-pointer items-center px-8 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <MessageCircle className='w-5 h-5 mx-2'/>
                                Contacter un bibliothécaire
                            </button>
                            <button
                                className="inline-flex cursor-pointer items-center px-8 py-3 rounded-lg font-medium border-2 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                                style={{
                                    borderColor: secondaryColor,
                                    color: secondaryColor
                                }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Guide d'utilisation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BooksPage;
