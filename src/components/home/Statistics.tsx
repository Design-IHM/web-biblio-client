import { useState, useEffect } from 'react';
import { Book, GraduationCap, Users, UserCheck, TrendingUp, Award, Clock, Building } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import { BiblioUser } from '../../types/auth';

// Types pour les statistiques
interface StatsData {
    books: number;
    theses: number;
    students: number;
    teachers: number;
    totalUsers: number;
    departments: number;
    loading: boolean;
}

interface AnimatedStatsData {
    books: number;
    theses: number;
    students: number;
    teachers: number;
    totalUsers: number;
    departments: number;
}

// Type pour React Component avec icône
type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number }>;

// Props pour StatCard
interface StatCardProps {
    icon: IconComponent;
    title: string;
    value: number;
    suffix?: string;
    description: string;
    color: string;
    delay?: number;
    showProgress?: boolean;
    loading?: boolean;
}

// Props pour AchievementBadge
interface AchievementBadgeProps {
    icon: IconComponent;
    title: string;
    description: string;
    color: string;
}

const Statistics: React.FC = () => {
    const { orgSettings } = useConfig();

    const [stats, setStats] = useState<StatsData>({
        books: 0,
        theses: 0,
        students: 0,
        teachers: 0,
        totalUsers: 0,
        departments: 0,
        loading: true
    });

    const [animatedStats, setAnimatedStats] = useState<AnimatedStatsData>({
        books: 0,
        theses: 0,
        students: 0,
        teachers: 0,
        totalUsers: 0,
        departments: 0
    });

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    useEffect(() => {
        const fetchStatistics = async (): Promise<void> => {
            try {
                // Récupérer le nombre de livres
                const booksSnapshot = await getDocs(collection(db, 'BiblioBooks'));
                const booksCount = booksSnapshot.size;

                // Récupérer le nombre de mémoires
                const thesesSnapshot = await getDocs(collection(db, 'BiblioThesis'));
                const thesesCount = thesesSnapshot.size;

                // Récupérer les utilisateurs et analyser par statut
                const usersSnapshot = await getDocs(collection(db, 'BiblioUser'));
                let studentsCount = 0;
                let teachersCount = 0;
                const departmentsSet = new Set<string>();

                usersSnapshot.forEach((doc) => {
                    const userData = doc.data() as BiblioUser;

                    // Compter par statut
                    if (userData.statut === 'etudiant') {
                        studentsCount++;
                    } else if (userData.statut === 'enseignant') {
                        teachersCount++;
                    }

                    // Collecter les départements uniques
                    if (userData.departement && userData.departement.trim() !== '') {
                        departmentsSet.add(userData.departement);
                    }
                });

                const totalUsers = usersSnapshot.size;
                const departmentsCount = departmentsSet.size;

                setStats({
                    books: booksCount,
                    theses: thesesCount,
                    students: studentsCount,
                    teachers: teachersCount,
                    totalUsers,
                    departments: departmentsCount,
                    loading: false
                });

            } catch (error) {
                console.error('❌ Erreur récupération statistiques:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStatistics();
    }, []);

    // Animation des compteurs
    useEffect(() => {
        if (stats.loading) return;

        const animateCounter = (
            targetValue: number,
            _currentValue: number,
            setter: (updater: (prev: number) => number) => void,
            delay: number = 0
        ) => {
            setTimeout(() => {
                const increment = Math.max(1, Math.ceil(targetValue / 30));
                const timer = setInterval(() => {
                    setter((prev: number) => {
                        const nextValue = prev + increment;
                        if (nextValue >= targetValue) {
                            clearInterval(timer);
                            return targetValue;
                        }
                        return nextValue;
                    });
                }, 50);
            }, delay);
        };

        // Démarrer les animations avec des délais échelonnés
        animateCounter(stats.books, animatedStats.books,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, books: updater(prev.books) })), 100);

        animateCounter(stats.theses, animatedStats.theses,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, theses: updater(prev.theses) })), 200);

        animateCounter(stats.students, animatedStats.students,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, students: updater(prev.students) })), 300);

        animateCounter(stats.teachers, animatedStats.teachers,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, teachers: updater(prev.teachers) })), 400);

        animateCounter(stats.totalUsers, animatedStats.totalUsers,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, totalUsers: updater(prev.totalUsers) })), 500);

        animateCounter(stats.departments, animatedStats.departments,
            (updater) => setAnimatedStats((prev: AnimatedStatsData) => ({ ...prev, departments: updater(prev.departments) })), 600);

    }, [stats]);

    // Composant StatCard
    const StatCard: React.FC<StatCardProps> = ({
                                                   icon: Icon,
                                                   title,
                                                   value,
                                                   suffix = '',
                                                   description,
                                                   color,
                                                   delay = 0,
                                                   showProgress = false,
                                                   loading = false
                                               }) => (
        <div
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-opacity-50"
            style={{
                animationDelay: `${delay}ms`,
                borderColor: `${color}20`
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon
                        className="w-7 h-7"
                        style={{ color }}
                    />
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                        ) : (
                            `${value.toLocaleString()}${suffix}`
                        )}
                    </div>
                    <div className="text-sm text-gray-500">{title}</div>
                </div>
            </div>

            <p className="text-gray-600 text-sm">{description}</p>

            {showProgress && !loading && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="h-1.5 rounded-full transition-all duration-1000"
                            style={{
                                backgroundColor: color,
                                width: '85%'
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );

    // Composant AchievementBadge
    const AchievementBadge: React.FC<AchievementBadgeProps> = ({
                                                                   icon: Icon,
                                                                   title,
                                                                   description,
                                                                   color
                                                               }) => (
        <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon
                    className="w-5 h-5"
                    style={{ color }}
                />
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
                <p className="text-gray-600 text-xs">{description}</p>
            </div>
        </div>
    );

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* En-tête de section */}
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl font-bold mb-4"
                        style={{ color: secondaryColor }}
                    >
                        Statistiques de {organizationName}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Découvrez les chiffres clés de notre bibliothèque et l'engagement de notre communauté académique.
                    </p>
                </div>

                {/* Grille des statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        icon={Book}
                        title="Livres disponibles"
                        value={animatedStats.books}
                        description="Ouvrages accessibles dans notre catalogue"
                        color={primaryColor}
                        delay={100}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={GraduationCap}
                        title="Mémoires & Thèses"
                        value={animatedStats.theses}
                        description="Travaux de recherche disponibles"
                        color="#10B981"
                        delay={200}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Users}
                        title="Étudiants"
                        value={animatedStats.students}
                        description="Étudiants inscrits et actifs"
                        color="#3B82F6"
                        delay={300}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={UserCheck}
                        title="Enseignants"
                        value={animatedStats.teachers}
                        description="Personnel enseignant membre"
                        color="#8B5CF6"
                        delay={400}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={TrendingUp}
                        title="Total Utilisateurs"
                        value={animatedStats.totalUsers}
                        description="Membres actifs de la communauté"
                        color="#F59E0B"
                        delay={500}
                        showProgress={true}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Building}
                        title="Départements"
                        value={animatedStats.departments}
                        description="Départements représentés"
                        color="#EF4444"
                        delay={600}
                        loading={stats.loading}
                    />
                </div>

                {/* Section réalisations */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h3
                            className="text-2xl font-bold mb-2"
                            style={{ color: secondaryColor }}
                        >
                            Nos Réalisations
                        </h3>
                        <p className="text-gray-600">
                            Les jalons importants de notre bibliothèque numérique
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AchievementBadge
                            icon={Award}
                            title="Excellence académique"
                            description="Ressources de qualité supérieure"
                            color={primaryColor}
                        />

                        <AchievementBadge
                            icon={Clock}
                            title="Service 24/7"
                            description="Accès continu aux ressources"
                            color="#10B981"
                        />

                        <AchievementBadge
                            icon={Book}
                            title="Catalogue diversifié"
                            description="Large gamme de disciplines"
                            color="#3B82F6"
                        />

                        <AchievementBadge
                            icon={Users}
                            title="Communauté active"
                            description="Engagement élevé des utilisateurs"
                            color="#8B5CF6"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
