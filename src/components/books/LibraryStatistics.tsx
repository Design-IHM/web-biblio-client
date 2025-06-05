import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Interface exacte selon votre structure
interface Comment {
    id: string;
    userId: string;
    text: string;
    createdAt: Timestamp;
}

interface BiblioBook {
    id: string;
    name: string;
    auteur: string;
    cathegorie: string;
    commentaire: Comment[];
    desc: string;
    edition: string;
    etagere: string;
    exemplaire: number;
    image: string;
    initialExemplaire: number;
}

interface LibraryStats {
    totalBooks: number;
    availableBooks: number;
    totalExemplaires: number;
    availableExemplaires: number;
    totalCategories: number;
    totalAuthors: number;
    totalPublishers: number;
    availabilityRate: number;
    mostPopularCategory: string;
    mostPopularAuthor: string;
    totalComments: number;
    averageCommentsPerBook: number;
    topShelf: string;
    booksWithoutImages: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    backgroundColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({
                                               title,
                                               value,
                                               subtitle,
                                               color,
                                               backgroundColor,
                                               trend
                                           }) => {
    return (
        <div
            className="text-center p-4 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105"
            style={{ backgroundColor }}
        >
            <div className="flex items-center justify-between mb-2">
                <div
                    className="text-2xl font-bold"
                    style={{ color }}
                >
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend && (
                    <div className={`flex items-center text-xs ${
                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend.isPositive ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-600 font-medium">
                {title}
            </div>
            {subtitle && (
                <div className="text-xs text-gray-500 mt-1">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

interface LibraryStatisticsProps {
    className?: string;
    showRefreshButton?: boolean;
    compact?: boolean;
}

const LibraryStatistics: React.FC<LibraryStatisticsProps> = ({
                                                                 className = "",
                                                                 showRefreshButton = true,
                                                                 compact = false
                                                             }) => {
    const { orgSettings } = useConfig();
    const [stats, setStats] = useState<LibraryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const fetchLibraryStatistics = async () => {
        try {
            setLoading(true);
            setError('');

            // Récupérer tous les livres de la collection BiblioBooks
            const booksSnapshot = await getDocs(collection(db, 'BiblioBooks'));
            const books: BiblioBook[] = [];

            booksSnapshot.forEach((doc) => {
                books.push({ id: doc.id, ...doc.data() } as BiblioBook);
            });

            if (books.length === 0) {
                throw new Error('Aucun livre trouvé dans la base de données');
            }

            // 1. Statistiques de base des livres
            const totalBooks = books.length;
            const availableBooks = books.filter(book => book.exemplaire > 0).length;
            const totalExemplaires = books.reduce((sum, book) => sum + (book.initialExemplaire || 0), 0);
            const availableExemplaires = books.reduce((sum, book) => sum + (book.exemplaire || 0), 0);
            const availabilityRate = totalExemplaires > 0 ? Math.round((availableExemplaires / totalExemplaires) * 100) : 0;

            // 2. Analyse des catégories
            const categoriesMap = new Map<string, number>();
            books.forEach(book => {
                if (book.cathegorie && book.cathegorie.trim()) {
                    const category = book.cathegorie.trim();
                    categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
                }
            });
            const totalCategories = categoriesMap.size;
            const mostPopularCategory = Array.from(categoriesMap.entries())
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non définie';

            // 3. Analyse des auteurs
            const authorsMap = new Map<string, number>();
            books.forEach(book => {
                if (book.auteur && book.auteur.trim()) {
                    const author = book.auteur.trim();
                    authorsMap.set(author, (authorsMap.get(author) || 0) + 1);
                }
            });
            const totalAuthors = authorsMap.size;
            const mostPopularAuthor = Array.from(authorsMap.entries())
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non défini';

            // 4. Analyse des éditeurs
            const publishersSet = new Set<string>();
            books.forEach(book => {
                if (book.edition && book.edition.trim()) {
                    publishersSet.add(book.edition.trim());
                }
            });
            const totalPublishers = publishersSet.size;

            // 5. Analyse des étagères
            const shelvesMap = new Map<string, number>();
            books.forEach(book => {
                if (book.etagere && book.etagere.trim()) {
                    const shelf = book.etagere.trim();
                    shelvesMap.set(shelf, (shelvesMap.get(shelf) || 0) + 1);
                }
            });
            const topShelf = Array.from(shelvesMap.entries())
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non définie';

            // 6. Analyse des commentaires
            const totalComments = books.reduce((sum, book) => {
                return sum + (book.commentaire ? book.commentaire.length : 0);
            }, 0);
            const averageCommentsPerBook = totalBooks > 0 ? Math.round((totalComments / totalBooks) * 10) / 10 : 0;

            // 7. Livres sans images
            const booksWithoutImages = books.filter(book => !book.image || book.image.trim() === '').length;

            const calculatedStats: LibraryStats = {
                totalBooks,
                availableBooks,
                totalExemplaires,
                availableExemplaires,
                totalCategories,
                totalAuthors,
                totalPublishers,
                availabilityRate,
                mostPopularCategory,
                mostPopularAuthor,
                totalComments,
                averageCommentsPerBook,
                topShelf,
                booksWithoutImages
            };

            setStats(calculatedStats);
            setLastUpdated(new Date());

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLibraryStatistics();
    }, []);

    const handleRefresh = () => {
        fetchLibraryStatistics();
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="md" text="Calcul des statistiques..." />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className={`bg-white rounded-xl border border-red-200 shadow-sm p-6 ${className}`}>
                <div className="text-center py-4">
                    <p className="text-red-600 mb-4">{error || 'Erreur inconnue'}</p>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-800">
                        Statistiques de la bibliothèque
                    </h3>
                    <p className="text-xs text-gray-500">
                        Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
                {showRefreshButton && (
                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Actualiser les statistiques"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Grille des statistiques principales */}
            <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                <StatCard
                    title="Total livres"
                    value={stats.totalBooks}
                    subtitle={`${stats.availableBooks} disponibles`}
                    color={primaryColor}
                    backgroundColor={`${primaryColor}08`}
                    trend={{
                        value: Math.round((stats.availableBooks / stats.totalBooks) * 100),
                        isPositive: stats.availabilityRate > 80
                    }}
                />

                <StatCard
                    title="Exemplaires"
                    value={`${stats.availableExemplaires}/${stats.totalExemplaires}`}
                    subtitle="Disponibles/Total"
                    color={secondaryColor}
                    backgroundColor={`${secondaryColor}08`}
                    trend={{
                        value: stats.availabilityRate,
                        isPositive: stats.availabilityRate >= 70
                    }}
                />

                <StatCard
                    title="Catégories"
                    value={stats.totalCategories}
                    subtitle={`Pop.: ${stats.mostPopularCategory}`}
                    color={primaryColor}
                    backgroundColor={`${primaryColor}08`}
                />

                <StatCard
                    title="Auteurs"
                    value={stats.totalAuthors}
                    subtitle={`Pop.: ${stats.mostPopularAuthor.length > 15 ? stats.mostPopularAuthor.substring(0, 15) + '...' : stats.mostPopularAuthor}`}
                    color={secondaryColor}
                    backgroundColor={`${secondaryColor}08`}
                />
            </div>

            {/* Statistiques secondaires en mode étendu */}
            {!compact && (
                <>
                    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Commentaires"
                            value={stats.totalComments}
                            subtitle={`${stats.averageCommentsPerBook} moy./livre`}
                            color={primaryColor}
                            backgroundColor={`${primaryColor}05`}
                        />

                        <StatCard
                            title="Éditeurs"
                            value={stats.totalPublishers}
                            subtitle="Maisons d'édition"
                            color={secondaryColor}
                            backgroundColor={`${secondaryColor}05`}
                        />

                        <StatCard
                            title="Étagère top"
                            value={stats.topShelf}
                            subtitle="Plus de livres"
                            color={primaryColor}
                            backgroundColor={`${primaryColor}05`}
                        />

                        <StatCard
                            title="Sans image"
                            value={stats.booksWithoutImages}
                            subtitle={`${Math.round((stats.booksWithoutImages / stats.totalBooks) * 100)}% du total`}
                            color={stats.booksWithoutImages > 0 ? '#ef4444' : '#10b981'}
                            backgroundColor={stats.booksWithoutImages > 0 ? '#ef444408' : '#10b98108'}
                        />
                    </div>

                    {/* Informations détaillées */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Catégorie populaire</h4>
                                <p className="text-lg font-bold" style={{ color: primaryColor }}>
                                    {stats.mostPopularCategory}
                                </p>
                                <p className="text-xs text-gray-600">
                                    Sur {stats.totalCategories} catégories
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Auteur populaire</h4>
                                <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                                    {stats.mostPopularAuthor.length > 20
                                        ? stats.mostPopularAuthor.substring(0, 20) + '...'
                                        : stats.mostPopularAuthor
                                    }
                                </p>
                                <p className="text-xs text-gray-600">
                                    Sur {stats.totalAuthors} auteurs
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Étagère principale</h4>
                                <p className="text-lg font-bold text-gray-800">
                                    {stats.topShelf}
                                </p>
                                <p className="text-xs text-gray-600">
                                    Contient le plus de livres
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Barre de progression globale */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Disponibilité globale</span>
                    <span>{stats.availabilityRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                            width: `${stats.availabilityRate}%`,
                            backgroundColor: stats.availabilityRate >= 70 ? '#10b981' :
                                stats.availabilityRate >= 50 ? '#f59e0b' : '#ef4444'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LibraryStatistics;
