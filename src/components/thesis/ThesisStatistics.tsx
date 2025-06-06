import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { BiblioThesis } from '../../types/thesis';

interface ThesisStats {
    totalTheses: number;
    totalDepartments: number;
    totalAuthors: number;
    totalSupervisors: number;
    totalComments: number;
    averageCommentsPerThesis: number;
    mostPopularDepartment: string;
    mostActiveDepartment: string;
    latestYear: number;
    oldestYear: number;
    thesesWithoutImages: number;
    averageRating: number;
    thesesByYear: { [key: number]: number };
    topKeywords: string[];
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

interface ThesisStatisticsProps {
    className?: string;
    showRefreshButton?: boolean;
    compact?: boolean;
}

const ThesisStatistics: React.FC<ThesisStatisticsProps> = ({
                                                               className = "",
                                                               showRefreshButton = true,
                                                               compact = false
                                                           }) => {
    const { orgSettings } = useConfig();
    const [stats, setStats] = useState<ThesisStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const fetchThesisStatistics = async () => {
        try {
            setLoading(true);
            setError('');

            // Récupérer tous les mémoires de la collection BiblioThesis
            const thesesSnapshot = await getDocs(collection(db, 'BiblioThesis'));
            const theses: BiblioThesis[] = [];

            thesesSnapshot.forEach((doc) => {
                theses.push({ id: doc.id, ...doc.data() } as BiblioThesis);
            });

            if (theses.length === 0) {
                throw new Error('Aucun mémoire trouvé dans la base de données');
            }

            // 1. Statistiques de base des mémoires
            const totalTheses = theses.length;

            // 2. Analyse des départements
            const departmentsMap = new Map<string, number>();
            theses.forEach(thesis => {
                if (thesis.département && thesis.département.trim()) {
                    const department = thesis.département.trim();
                    departmentsMap.set(department, (departmentsMap.get(department) || 0) + 1);
                }
            });
            const totalDepartments = departmentsMap.size;
            const mostPopularDepartment = Array.from(departmentsMap.entries())
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non défini';

            // 3. Analyse des auteurs
            const authorsSet = new Set<string>();
            theses.forEach(thesis => {
                if (thesis.name && thesis.name.trim()) {
                    authorsSet.add(thesis.name.trim());
                }
            });
            const totalAuthors = authorsSet.size;

            // 4. Analyse des superviseurs
            const supervisorsSet = new Set<string>();
            theses.forEach(thesis => {
                if (thesis.superviseur && thesis.superviseur.trim()) {
                    supervisorsSet.add(thesis.superviseur.trim());
                }
            });
            const totalSupervisors = supervisorsSet.size;

            // 5. Analyse des années
            const years = theses.map(thesis => thesis.annee).filter(year => year);
            const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();
            const oldestYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();

            // Répartition par année
            const thesesByYear: { [key: number]: number } = {};
            years.forEach(year => {
                thesesByYear[year] = (thesesByYear[year] || 0) + 1;
            });

            // 6. Analyse des commentaires et notes
            const totalComments = theses.reduce((sum, thesis) => {
                return sum + (thesis.commentaire ? thesis.commentaire.length : 0);
            }, 0);
            const averageCommentsPerThesis = totalTheses > 0 ? Math.round((totalComments / totalTheses) * 10) / 10 : 0;

            // Calcul de la note moyenne globale
            let totalRatings = 0;
            let ratingCount = 0;
            theses.forEach(thesis => {
                if (thesis.commentaire && thesis.commentaire.length > 0) {
                    thesis.commentaire.forEach(comment => {
                        if (comment.note && comment.note > 0) {
                            totalRatings += comment.note;
                            ratingCount++;
                        }
                    });
                }
            });
            const averageRating = ratingCount > 0 ? Math.round((totalRatings / ratingCount) * 10) / 10 : 0;

            // 7. Mémoires sans images
            const thesesWithoutImages = theses.filter(thesis => !thesis.image || thesis.image.trim() === '').length;

            // 8. Analyse des mots-clés les plus populaires
            const keywordsMap = new Map<string, number>();
            theses.forEach(thesis => {
                if (thesis.keywords && thesis.keywords.trim()) {
                    const keywords = thesis.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
                    keywords.forEach(keyword => {
                        keywordsMap.set(keyword.toLowerCase(), (keywordsMap.get(keyword.toLowerCase()) || 0) + 1);
                    });
                }
            });
            const topKeywords = Array.from(keywordsMap.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([keyword]) => keyword);

            // Département le plus actif (le plus de mémoires récents)
            const recentTheses = theses.filter(thesis => thesis.annee >= latestYear - 1);
            const recentDepartmentsMap = new Map<string, number>();
            recentTheses.forEach(thesis => {
                if (thesis.département && thesis.département.trim()) {
                    const department = thesis.département.trim();
                    recentDepartmentsMap.set(department, (recentDepartmentsMap.get(department) || 0) + 1);
                }
            });
            const mostActiveDepartment = Array.from(recentDepartmentsMap.entries())
                .sort(([,a], [,b]) => b - a)[0]?.[0] || mostPopularDepartment;

            const calculatedStats: ThesisStats = {
                totalTheses,
                totalDepartments,
                totalAuthors,
                totalSupervisors,
                totalComments,
                averageCommentsPerThesis,
                mostPopularDepartment,
                mostActiveDepartment,
                latestYear,
                oldestYear,
                thesesWithoutImages,
                averageRating,
                thesesByYear,
                topKeywords
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
        fetchThesisStatistics();
    }, []);

    const handleRefresh = () => {
        fetchThesisStatistics();
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="md" text="Calcul des statistiques des mémoires..." />
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

    // Calcul des tendances
    const currentYearCount = stats.thesesByYear[stats.latestYear] || 0;
    const previousYearCount = stats.thesesByYear[stats.latestYear - 1] || 0;
    const yearTrend = previousYearCount > 0
        ? Math.round(((currentYearCount - previousYearCount) / previousYearCount) * 100)
        : 0;

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-800">
                        Statistiques des mémoires
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
                    title="Total mémoires"
                    value={stats.totalTheses}
                    subtitle={`Span: ${stats.oldestYear}-${stats.latestYear}`}
                    color={primaryColor}
                    backgroundColor={`${primaryColor}08`}
                    trend={{
                        value: yearTrend,
                        isPositive: yearTrend > 0
                    }}
                />

                <StatCard
                    title="Départements"
                    value={stats.totalDepartments}
                    subtitle={`Pop.: ${stats.mostPopularDepartment.length > 12 ? stats.mostPopularDepartment.substring(0, 12) + '...' : stats.mostPopularDepartment}`}
                    color={secondaryColor}
                    backgroundColor={`${secondaryColor}08`}
                />

                <StatCard
                    title="Auteurs"
                    value={stats.totalAuthors}
                    subtitle={`${stats.totalSupervisors} superviseurs`}
                    color={primaryColor}
                    backgroundColor={`${primaryColor}08`}
                />

                <StatCard
                    title="Note moyenne"
                    value={stats.averageRating > 0 ? `${stats.averageRating}/5` : 'N/A'}
                    subtitle={`${stats.totalComments} avis total`}
                    color={stats.averageRating >= 4 ? '#10b981' : stats.averageRating >= 3 ? '#f59e0b' : '#ef4444'}
                    backgroundColor={stats.averageRating >= 4 ? '#10b98108' : stats.averageRating >= 3 ? '#f59e0b08' : '#ef444408'}
                />
            </div>

            {/* Statistiques secondaires en mode étendu */}
            {!compact && (
                <>
                    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Dernière année"
                            value={stats.latestYear}
                            subtitle={`${currentYearCount} mémoires`}
                            color={primaryColor}
                            backgroundColor={`${primaryColor}05`}
                        />

                        <StatCard
                            title="Commentaires"
                            value={stats.totalComments}
                            subtitle={`${stats.averageCommentsPerThesis} moy./mémoire`}
                            color={secondaryColor}
                            backgroundColor={`${secondaryColor}05`}
                        />

                        <StatCard
                            title="Dept. actif"
                            value={stats.mostActiveDepartment.length > 10 ? stats.mostActiveDepartment.substring(0, 10) + '...' : stats.mostActiveDepartment}
                            subtitle="Plus récents travaux"
                            color={primaryColor}
                            backgroundColor={`${primaryColor}05`}
                        />

                        <StatCard
                            title="Sans image"
                            value={stats.thesesWithoutImages}
                            subtitle={`${Math.round((stats.thesesWithoutImages / stats.totalTheses) * 100)}% du total`}
                            color={stats.thesesWithoutImages > 0 ? '#ef4444' : '#10b981'}
                            backgroundColor={stats.thesesWithoutImages > 0 ? '#ef444408' : '#10b98108'}
                        />
                    </div>

                    {/* Informations détaillées */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Département populaire</h4>
                                <p className="text-lg font-bold" style={{ color: primaryColor }}>
                                    {stats.mostPopularDepartment}
                                </p>
                                <p className="text-xs text-gray-600">
                                    Sur {stats.totalDepartments} départements
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Répartition temporelle</h4>
                                <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                                    {stats.latestYear - stats.oldestYear + 1} années
                                </p>
                                <p className="text-xs text-gray-600">
                                    De {stats.oldestYear} à {stats.latestYear}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">Mots-clés populaires</h4>
                                <div className="flex flex-wrap gap-1">
                                    {stats.topKeywords.slice(0, 3).map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: `${primaryColor}15`,
                                                color: primaryColor
                                            }}
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Barre de progression de qualité */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Qualité moyenne des mémoires</span>
                    <span>{stats.averageRating > 0 ? `${stats.averageRating}/5` : 'Non évalué'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                            width: `${stats.averageRating > 0 ? (stats.averageRating / 5) * 100 : 0}%`,
                            backgroundColor: stats.averageRating >= 4 ? '#10b981' :
                                stats.averageRating >= 3 ? '#f59e0b' : '#ef4444'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThesisStatistics;
