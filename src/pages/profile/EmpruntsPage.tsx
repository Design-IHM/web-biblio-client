import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { authService } from '../../services/auth/authService';
import { BiblioUser, TabEtatEntry } from '../../types/auth';
import {
    BookOpen,
    AlertTriangle,
    Eye,
    Clock,
    RefreshCw,
    Search,
    CheckCircle,
    Tag,
    Download
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface EmpruntItem {
    id: string;
    name: string;
    category: string;
    image: string;
    borrowedAt: Date;
    dueDate: Date;
    isOverdue: boolean;
    daysRemaining: number;
    entry: TabEtatEntry;
}

const EmpruntsPage: React.FC = () => {
    const navigate = useNavigate();
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';
    const maxLoans = orgSettings?.MaximumSimultaneousLoans || 5;
    const loanDuration = 30; // Durée d'emprunt en jours (vous pouvez la récupérer de orgSettings)

    const [currentUser, setCurrentUser] = useState<BiblioUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [emprunts, setEmprunts] = useState<EmpruntItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'tous' | 'en_cours' | 'en_retard'>('tous');

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (currentUser) {
            extractEmprunts();
        }
    }, [currentUser, maxLoans]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
            setLoading(false);
        }
    };

    const extractEmprunts = () => {
        if (!currentUser) return;

        const empruntItems: EmpruntItem[] = [];

        for (let i = 1; i <= maxLoans; i++) {
            const etatKey = `etat${i}` as keyof typeof currentUser;
            const tabEtatKey = `tabEtat${i}` as keyof typeof currentUser;

            if (currentUser[etatKey] === 'emprunt' && Array.isArray(currentUser[tabEtatKey])) {
                const entry = currentUser[tabEtatKey] as TabEtatEntry;
                const [idDoc, nameDoc, category, image, , , borrowDateStr] = entry;

                // Calculer les dates (simulation basée sur une date d'emprunt)
                const borrowedAt = borrowDateStr ? new Date(borrowDateStr) : new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000);
                const dueDate = new Date(borrowedAt.getTime() + loanDuration * 24 * 60 * 60 * 1000);
                const now = new Date();
                const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysRemaining < 0;

                empruntItems.push({
                    id: idDoc,
                    name: nameDoc,
                    category: category || 'Non catégorisé',
                    image: image || '/api/placeholder/120/160',
                    borrowedAt,
                    dueDate,
                    isOverdue,
                    daysRemaining,
                    entry
                });
            }
        }

        setEmprunts(empruntItems);
    };

    const max = orgSettings?.MaximumSimultaneousLoans || 5
    const handleReturnEmprunt = async (emprunt: EmpruntItem) => {
        if (!currentUser) return;

        try {
            console.log('Retour de l\'emprunt:', emprunt.name);

            let etatIndex: number | null = null;
            let tabEtat: TabEtatEntry | undefined = undefined;

            for (let i = 1; i <= max; i++) {
                const tabKey = `tabEtat${i}` as keyof BiblioUser;
                const value = currentUser[tabKey];

                if (Array.isArray(value) && value[0] === emprunt.id) {
                    etatIndex = i;
                    tabEtat = value as TabEtatEntry;
                    break;
                }
            }

            if (etatIndex === null) {
                console.warn("État de l'emprunt non trouvé");
                return;
            }

            await authService.updateEtatEmprunt(currentUser.email, etatIndex, 'ras', tabEtat);

            await loadUserData();

        } catch (error) {
            console.error('Erreur lors du retour:', error);
        }
    };


    const filteredEmprunts = emprunts.filter(emprunt => {
        const matchesSearch = emprunt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emprunt.category.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterStatus === 'en_cours') {
            matchesFilter = !emprunt.isOverdue;
        } else if (filterStatus === 'en_retard') {
            matchesFilter = emprunt.isOverdue;
        }

        return matchesSearch && matchesFilter;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (emprunt: EmpruntItem) => {
        if (emprunt.isOverdue) {
            return <Badge variant="error" size="sm">En retard</Badge>;
        } else if (emprunt.daysRemaining <= 3) {
            return <Badge variant="warning" size="sm">Bientôt dû</Badge>;
        } else {
            return <Badge variant="success" size="sm">En cours</Badge>;
        }
    };

    const getDaysText = (emprunt: EmpruntItem) => {
        if (emprunt.isOverdue) {
            return `En retard de ${Math.abs(emprunt.daysRemaining)} jour${Math.abs(emprunt.daysRemaining) > 1 ? 's' : ''}`;
        } else if (emprunt.daysRemaining === 0) {
            return 'À rendre aujourd\'hui';
        } else if (emprunt.daysRemaining === 1) {
            return 'À rendre demain';
        } else {
            return `${emprunt.daysRemaining} jours restants`;
        }
    };

    // Statistiques
    const stats = {
        total: emprunts.length,
        enCours: emprunts.filter(e => !e.isOverdue).length,
        enRetard: emprunts.filter(e => e.isOverdue).length,
        bientotDus: emprunts.filter(e => !e.isOverdue && e.daysRemaining <= 3).length
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Chargement de vos emprunts..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* En-tête avec statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card variant="glass" padding="md" hover>
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}15` }}
                        >
                            <BookOpen size={24} style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
                                {stats.total}
                            </p>
                            <p className="text-sm text-gray-600">Total emprunts</p>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" padding="md" hover>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{stats.enCours}</p>
                            <p className="text-sm text-gray-600">En cours</p>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" padding="md" hover>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100">
                            <Clock size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">{stats.bientotDus}</p>
                            <p className="text-sm text-gray-600">Bientôt dus</p>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" padding="md" hover>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{stats.enRetard}</p>
                            <p className="text-sm text-gray-600">En retard</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Barre de recherche et filtres */}
            <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Rechercher un emprunt..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search size={18} />}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={filterStatus === 'tous' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('tous')}
                            className="cursor-pointer"
                        >
                            Tous
                        </Button>
                        <Button
                            variant={filterStatus === 'en_cours' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('en_cours')}
                            className="cursor-pointer"
                        >
                            En cours
                        </Button>
                        <Button
                            variant={filterStatus === 'en_retard' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('en_retard')}
                            className="cursor-pointer"
                        >
                            En retard
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={loadUserData}
                            className="cursor-pointer"
                        >
                            Actualiser
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Liste des emprunts */}
            {filteredEmprunts.length === 0 ? (
                <Card variant="elevated" padding="xl">
                    <div className="text-center py-12">
                        {searchTerm || filterStatus !== 'tous' ? (
                            <>
                                <Search size={64} className="mx-auto text-gray-400 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucun emprunt trouvé
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Aucun emprunt ne correspond à vos critères de recherche
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('tous');
                                    }}
                                    className="cursor-pointer"
                                >
                                    Effacer les filtres
                                </Button>
                            </>
                        ) : (
                            <>
                                <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucun emprunt en cours
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Vous n'avez aucun livre emprunté actuellement. Explorez notre catalogue pour emprunter des livres.
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/books')}
                                    leftIcon={<BookOpen size={16} />}
                                    className="cursor-pointer"
                                >
                                    Explorer le catalogue
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    {filteredEmprunts.map((emprunt, index) => (
                        <Card key={`${emprunt.id}-${index}`} variant="elevated" padding="lg" hover>
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Image du livre */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-44 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                        <img
                                            src={emprunt.image}
                                            alt={emprunt.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/api/placeholder/120/160';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Informations de l'emprunt */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                                    {emprunt.name}
                                                </h3>
                                                {getStatusBadge(emprunt)}
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag size={16} style={{ color: primaryColor }} />
                                                <span className="text-gray-600 font-medium">{emprunt.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Détails des dates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">Date d'emprunt</p>
                                            <p className="text-sm text-gray-600">{formatDate(emprunt.borrowedAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">Date de retour prévue</p>
                                            <p className={`text-sm font-medium ${
                                                emprunt.isOverdue ? 'text-red-600' :
                                                    emprunt.daysRemaining <= 3 ? 'text-orange-600' :
                                                        'text-gray-600'
                                            }`}>
                                                {formatDate(emprunt.dueDate)}
                                            </p>
                                            <p className={`text-xs ${
                                                emprunt.isOverdue ? 'text-red-600' :
                                                    emprunt.daysRemaining <= 3 ? 'text-orange-600' :
                                                        'text-gray-500'
                                            }`}>
                                                {getDaysText(emprunt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Barre de progression du temps */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Progression</span>
                                            <span>{Math.max(0, Math.min(100, Math.round(((loanDuration - emprunt.daysRemaining) / loanDuration) * 100)))}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.max(0, Math.min(100, ((loanDuration - emprunt.daysRemaining) / loanDuration) * 100))}%`,
                                                    backgroundColor: emprunt.isOverdue ? '#ef4444' :
                                                        emprunt.daysRemaining <= 3 ? '#f59e0b' :
                                                            primaryColor
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<Eye size={16} />}
                                            onClick={() => navigate(`/books/${emprunt.id}`)}
                                            className="cursor-pointer"
                                        >
                                            Voir les détails
                                        </Button>

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<CheckCircle size={16} />}
                                            onClick={() => handleReturnEmprunt(emprunt)}
                                            className="cursor-pointer"
                                        >
                                            Marquer comme rendu
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Actions globales */}
            {emprunts.length > 0 && (
                <Card variant="glass" padding="lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Gestion des emprunts
                            </h3>
                            <p className="text-sm text-gray-600">
                                Vous avez {emprunts.length} emprunt{emprunts.length > 1 ? 's' : ''} en cours
                                {stats.enRetard > 0 && (
                                    <span className="text-red-600 font-medium">
                    {' '}• {stats.enRetard} en retard
                  </span>
                                )}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/books')}
                                leftIcon={<BookOpen size={16} />}
                                className="cursor-pointer"
                            >
                                Emprunter plus
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Download size={16} />}
                                onClick={() => window.print()}
                                className="cursor-pointer"
                            >
                                Exporter la liste
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EmpruntsPage;
