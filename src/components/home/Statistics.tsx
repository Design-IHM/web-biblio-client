import { useState, useEffect } from 'react';
import { Book, GraduationCap, Users, UserCheck, TrendingUp, Award, Clock, Building } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';

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

// Types pour les utilisateurs Firebase
interface BiblioUser {
    statut: 'etudiant' | 'enseignant';
    departement?: string;
}

// Types pour React Component avec icône
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
                    if (userData.statut === 'etudiant') {
                        studentsCount++;
                        if (userData.departement) {
                            departmentsSet.add(userData.departement);
                        }
                    } else if (userData.statut === 'enseignant') {
                        teachersCount++;
                        if (userData.departement) {
                            departmentsSet.add(userData.departement);
                        }
                    }
                });

                const finalStats: StatsData = {
                    books: booksCount,
                    theses: thesesCount,
                    students: studentsCount,
                    teachers: teachersCount,
                    totalUsers: usersSnapshot.size,
                    departments: departmentsSet.size || 8, // Valeur par défaut si aucun département
                    loading: false
                };

                setStats(finalStats);

                // Animation des compteurs
                animateCounters(finalStats);
            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStatistics();
    }, []);

    const animateCounters = (finalStats: StatsData): void => {
        const duration = 2000; // 2 secondes
        const steps = 60;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setAnimatedStats({
                books: Math.floor(finalStats.books * progress),
                theses: Math.floor(finalStats.theses * progress),
                students: Math.floor(finalStats.students * progress),
                teachers: Math.floor(finalStats.teachers * progress),
                totalUsers: Math.floor(finalStats.totalUsers * progress),
                departments: Math.floor(finalStats.departments * progress)
            });

            if (currentStep >= steps) {
                clearInterval(interval);
                setAnimatedStats({
                    books: finalStats.books,
                    theses: finalStats.theses,
                    students: finalStats.students,
                    teachers: finalStats.teachers,
                    totalUsers: finalStats.totalUsers,
                    departments: finalStats.departments
                });
            }
        }, stepDuration);
    };

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
            className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl border border-gray-100"
            style={{
                animationDelay: `${delay}ms`,
                animation: loading ? 'none' : 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon className="w-7 h-7" style={{ color }} />
                </div>

                <div className="text-right">
                    <div className="flex items-baseline">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                        ) : (
                            <>
                <span
                    className="text-3xl font-bold"
                    style={{ color }}
                >
                  {value.toLocaleString()}
                </span>
                                {suffix && (
                                    <span
                                        className="text-lg font-medium ml-1"
                                        style={{ color }}
                                    >
                    {suffix}
                  </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>

            {/* Progress bar optionnelle */}
            {showProgress && !loading && (
                <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{
                                width: `${Math.min((value / 100) * 100, 100)}%`,
                                backgroundColor: color
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );

    const AchievementBadge: React.FC<AchievementBadgeProps> = ({ icon: Icon, title, description, color }) => (
        <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5 blur-3xl"
                    style={{ backgroundColor: primaryColor }}
                ></div>
                <div
                    className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-5 blur-3xl"
                    style={{ backgroundColor: secondaryColor }}
                ></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-1 rounded-full"
                            style={{
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                            }}
                        />
                    </div>

                    <span
                        className="inline-block py-2 px-4 rounded-full text-sm font-bold mb-4"
                        style={{
                            backgroundColor: `${primaryColor}10`,
                            color: primaryColor
                        }}
                    >
            Statistiques {organizationName}
          </span>

                    <h2 className="text-4xl font-bold mb-6" style={{ color: secondaryColor }}>
                        Notre Impact Académique
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les chiffres qui témoignent de notre engagement
                        envers l'excellence académique et l'innovation pédagogique.
                    </p>
                </div>

                {/* Main Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        icon={Book}
                        title="Livres Disponibles"
                        value={animatedStats.books}
                        description="Ouvrages académiques et scientifiques"
                        color={primaryColor}
                        delay={100}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={GraduationCap}
                        title="Mémoires & Thèses"
                        value={animatedStats.theses}
                        description="Travaux de recherche archivés"
                        color={secondaryColor}
                        delay={200}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Users}
                        title="Étudiants Actifs"
                        value={animatedStats.students}
                        description="Membres étudiants inscrits"
                        color={primaryColor}
                        delay={300}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={UserCheck}
                        title="Enseignants"
                        value={animatedStats.teachers}
                        description="Corps professoral enregistré"
                        color={secondaryColor}
                        delay={400}
                        loading={stats.loading}
                    />
                </div>

                {/* Secondary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        icon={TrendingUp}
                        title="Total Utilisateurs"
                        value={animatedStats.totalUsers}
                        description="Ensemble de la communauté"
                        color="#10b981"
                        delay={500}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Building}
                        title="Départements"
                        value={animatedStats.departments}
                        description="Filières académiques couvertes"
                        color="#8b5cf6"
                        delay={600}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Award}
                        title="Taux d'Activité"
                        value={stats.totalUsers > 0 ? Math.round((animatedStats.students + animatedStats.teachers) / animatedStats.totalUsers * 100) : 0}
                        suffix="%"
                        description="Utilisateurs actifs vs inscrits"
                        color="#f59e0b"
                        delay={700}
                        showProgress={true}
                        loading={stats.loading}
                    />

                    <StatCard
                        icon={Clock}
                        title="Ressources par Utilisateur"
                        value={animatedStats.totalUsers > 0 ? Math.round((animatedStats.books + animatedStats.theses) / animatedStats.totalUsers) : 0}
                        description="Ratio ressources/utilisateur"
                        color="#ef4444"
                        delay={800}
                        loading={stats.loading}
                    />
                </div>

                {/* Achievements Section */}
                <div className="bg-gray-50 rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: secondaryColor }}>
                            Nos Réalisations
                        </h3>
                        <p className="text-gray-600">
                            Reconnaissances et accomplissements de notre bibliothèque universitaire
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AchievementBadge
                            icon={Award}
                            title="Système Digitalisé"
                            description="Gestion moderne et efficace des ressources"
                            color="#f59e0b"
                        />

                        <AchievementBadge
                            icon={TrendingUp}
                            title="Croissance Continue"
                            description={`${animatedStats.books + animatedStats.theses} ressources disponibles`}
                            color="#10b981"
                        />

                        <AchievementBadge
                            icon={Users}
                            title="Communauté Active"
                            description={`${animatedStats.totalUsers} membres de la communauté`}
                            color="#3b82f6"
                        />

                        <AchievementBadge
                            icon={Book}
                            title="Collection Diversifiée"
                            description={`${animatedStats.departments} départements couverts`}
                            color={primaryColor}
                        />

                        <AchievementBadge
                            icon={GraduationCap}
                            title="Recherche Académique"
                            description="Soutien à la recherche universitaire"
                            color={secondaryColor}
                        />

                        <AchievementBadge
                            icon={Clock}
                            title="Disponibilité 24/7"
                            description="Accès en ligne à tout moment"
                            color="#8b5cf6"
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div
                        className="inline-block p-8 rounded-2xl shadow-xl"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-4" style={{ color: secondaryColor }}>
                            Rejoignez Notre Communauté Académique
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Devenez membre de {organizationName} et accédez à toutes nos ressources
                            pour enrichir votre parcours académique.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/auth"
                                className="px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                            >
                                S'inscrire maintenant
                            </a>
                            <a
                                href="/catalogue"
                                className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 border-2"
                                style={{
                                    borderColor: secondaryColor,
                                    color: secondaryColor
                                }}
                            >
                                Explorer le catalogue
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </section>
    );
};

export default Statistics;
