import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ThesisCard from './ThesisCard';
import { ThesisSortOption, ViewMode } from './ThesisSortOptions';
import { BiblioThesis, ThesisSearchFilters } from '../../types/thesis';
import {
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    RefreshCw,
    AlertCircle,
    Search
} from 'lucide-react';

interface ThesisListProps {
    searchFilters: ThesisSearchFilters;
    selectedDepartments: string[];
    sortOption: ThesisSortOption;
    viewMode: ViewMode;
    onThesisView?: (thesisId: string) => void;
    onToggleFavorite?: (thesisId: string) => void;
    favoriteTheses?: string[];
    className?: string;
}

const ThesisList: React.FC<ThesisListProps> = ({
                                                   searchFilters,
                                                   selectedDepartments,
                                                   sortOption,
                                                   viewMode,
                                                   onThesisView,
                                                   onToggleFavorite,
                                                   favoriteTheses = [],
                                                   className = ""
                                               }) => {
    const { orgSettings } = useConfig();
    const [allTheses, setAllTheses] = useState<BiblioThesis[]>([]);
    const [filteredTheses, setFilteredTheses] = useState<BiblioThesis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const THESES_PER_PAGE = 12;

    const loadAllTheses = async () => {
        try {
            setLoading(true);
            setError('');

            // Requête pour récupérer tous les mémoires
            const thesesQuery = query(
                collection(db, 'BiblioThesis'),
                orderBy('name', 'asc')
            );

            const querySnapshot = await getDocs(thesesQuery);
            const theses: BiblioThesis[] = [];

            querySnapshot.forEach((doc) => {
                const thesisData = { id: doc.id, ...doc.data() } as BiblioThesis;
                theses.push(thesisData);
            });

            setAllTheses(theses);

        } catch {
            setError('Erreur lors du chargement des mémoires. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Charger les mémoires au montage
    useEffect(() => {
        loadAllTheses();
    }, []);

    // Appliquer les filtres et le tri côté client
    useEffect(() => {
        let filtered = [...allTheses];

        // 1. Filtrer par départements
        if (selectedDepartments.length > 0) {
            filtered = filtered.filter(thesis =>
                selectedDepartments.includes(thesis.département)
            );
        }

        // 2. Filtrer par recherche textuelle
        if (searchFilters.query.trim()) {
            const searchTerm = searchFilters.query.toLowerCase();
            filtered = filtered.filter(thesis =>
                thesis.name.toLowerCase().includes(searchTerm) ||
                thesis.département.toLowerCase().includes(searchTerm) ||
                thesis.matricule.toLowerCase().includes(searchTerm) ||
                (thesis.theme && thesis.theme.toLowerCase().includes(searchTerm)) ||
                (thesis.abstract && thesis.abstract.toLowerCase().includes(searchTerm)) ||
                (thesis.keywords && thesis.keywords.toLowerCase().includes(searchTerm))
            );
        }

        // 3. Filtres avancés
        if (searchFilters.author.trim()) {
            filtered = filtered.filter(thesis =>
                thesis.name.toLowerCase().includes(searchFilters.author.toLowerCase())
            );
        }

        if (searchFilters.department.trim()) {
            filtered = filtered.filter(thesis =>
                thesis.département.toLowerCase().includes(searchFilters.department.toLowerCase())
            );
        }

        if (searchFilters.supervisor.trim()) {
            filtered = filtered.filter(thesis =>
                thesis.superviseur && thesis.superviseur.toLowerCase().includes(searchFilters.supervisor.toLowerCase())
            );
        }

        if (searchFilters.year.trim()) {
            const year = parseInt(searchFilters.year);
            if (!isNaN(year)) {
                filtered = filtered.filter(thesis => thesis.annee === year);
            }
        }

        if (searchFilters.keywords.trim()) {
            filtered = filtered.filter(thesis =>
                thesis.keywords && thesis.keywords.toLowerCase().includes(searchFilters.keywords.toLowerCase())
            );
        }

        // 4. Appliquer le tri
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'year-desc':
                    return b.annee - a.annee;
                case 'year-asc':
                    return a.annee - b.annee;
                case 'department-asc':
                    return a.département.localeCompare(b.département);
                case 'rating-desc':
                    { const avgRatingA = a.commentaire.length > 0
                        ? a.commentaire.reduce((sum, c) => sum + c.note, 0) / a.commentaire.length
                        : 0;
                    const avgRatingB = b.commentaire.length > 0
                        ? b.commentaire.reduce((sum, c) => sum + c.note, 0) / b.commentaire.length
                        : 0;
                    return avgRatingB - avgRatingA; }
                default:
                    return 0;
            }
        });

        setFilteredTheses(filtered);
        setCurrentPage(1);

    }, [allTheses, searchFilters, selectedDepartments, sortOption]);

    // Calculer les statistiques
    const totalPages = Math.ceil(filteredTheses.length / THESES_PER_PAGE);
    const startIndex = (currentPage - 1) * THESES_PER_PAGE;
    const endIndex = startIndex + THESES_PER_PAGE;
    const currentTheses = filteredTheses.slice(startIndex, endIndex);

    // Navigation des pages
    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Recharger les données
    const handleRefresh = () => {
        loadAllTheses();
    };

    // Gestion de la consultation
    const handleThesisView = async (thesisId: string) => {
        if (onThesisView) {
            await onThesisView(thesisId);
            handleRefresh();
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <LoadingSpinner size="lg" text="Chargement des mémoires..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white rounded-xl border border-red-200 p-8 text-center ${className}`}>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: primaryColor }}
                >
                    <RefreshCw className="w-4 h-4 mr-2 cursor-pointer" />
                    Réessayer
                </button>
            </div>
        );
    }

    if (filteredTheses.length === 0) {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 p-12 text-center ${className}`}>
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: `${primaryColor}10` }}
                >
                    <Search className="w-10 h-10" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun mémoire trouvé</h3>
                <p className="text-gray-600 mb-6">
                    Aucun mémoire ne correspond à vos critères de recherche.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                    <p>• Vérifiez l'orthographe de vos mots-clés</p>
                    <p>• Utilisez des termes plus généraux</p>
                    <p>• Réduisez le nombre de filtres</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* En-tête avec statistiques */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                        {filteredTheses.length} mémoire{filteredTheses.length !== 1 ? 's' : ''}
                        {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
                    </span>
                </div>

                <button
                    onClick={handleRefresh}
                    className="p-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                    title="Actualiser"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Grille/Liste des mémoires */}
            <div className={`${
                viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
            }`}>
                {currentTheses.map((thesis) => (
                    <ThesisCard
                        key={thesis.id}
                        thesis={thesis}
                        viewMode={viewMode}
                        onView={handleThesisView}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favoriteTheses.includes(thesis.id)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center">
                    <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`p-3 cursor-pointer transition-colors ${
                                currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Pages */}
                        <div className="flex items-center px-4 py-3 text-sm text-gray-600">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`p-3 cursor-pointer transition-colors ${
                                currentPage === totalPages
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Informations sur la pagination */}
            {filteredTheses.length > THESES_PER_PAGE && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredTheses.length)} sur {filteredTheses.length} mémoire{filteredTheses.length > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default ThesisList;
