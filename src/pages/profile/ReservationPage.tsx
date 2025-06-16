import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { authService } from '../../services/auth/authService';
import { cancelReservation } from '../../services/cancelReservation';
import { BiblioUser, TabEtatEntry } from '../../types/auth';
import {
    ShoppingCart,
    Eye,
    Calendar,
    Book,
    Tag,
    Clock,
    Trash2,
    RefreshCw,
    Search,
    Filter
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface ReservationItem {
    id: string;
    name: string;
    category: string;
    image: string;
    reservedAt: Date;
    entry: TabEtatEntry;
}

const ReservationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';
    const maxLoans = orgSettings?.MaximumSimultaneousLoans || 5;

    const [currentUser, setCurrentUser] = useState<BiblioUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (currentUser) {
            extractReservations();
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

    const extractReservations = () => {
        if (!currentUser) return;

        const reservationItems: ReservationItem[] = [];

        for (let i = 1; i <= maxLoans; i++) {
            const etatKey = `etat${i}` as keyof typeof currentUser;
            const tabEtatKey = `tabEtat${i}` as keyof typeof currentUser;

            if (currentUser[etatKey] === 'reserv' && Array.isArray(currentUser[tabEtatKey])) {
                const entry = currentUser[tabEtatKey] as TabEtatEntry;
                const [idDoc, nameDoc, category, image] = entry;

                reservationItems.push({
                    id: idDoc,
                    name: nameDoc,
                    category: category || 'Non catégorisé',
                    image: image || '/api/placeholder/120/160',
                    reservedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Simulation
                    entry
                });
            }
        }

        setReservations(reservationItems);
    };

    const handleCancelReservation = async (reservation: ReservationItem) => {
        if (!currentUser || cancellingIds.has(reservation.id)) return;

        setCancellingIds(prev => new Set(prev).add(reservation.id));

        try {
            await cancelReservation(currentUser, {
                name: reservation.name,
                id: reservation.id,
                collection: 'BiblioBooks',
            });

            const updatedUser = await authService.getCurrentUser();
            setCurrentUser(updatedUser);

            // Afficher un message de succès (vous pouvez implémenter un toast ici)
            console.log('Réservation annulée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la réservation:', error);
            // Afficher un message d'erreur (vous pouvez implémenter un toast ici)
        } finally {
            setCancellingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(reservation.id);
                return newSet;
            });
        }
    };

    const filteredReservations = reservations.filter(reservation =>
        reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Il y a moins d\'une heure';
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Hier';
        if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
        return formatDate(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Chargement de vos réservations..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* En-tête avec statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" padding="lg" hover>
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: `${primaryColor}15` }}
                        >
                            <ShoppingCart size={32} style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold" style={{ color: secondaryColor }}>
                                {reservations.length}
                            </p>
                            <p className="text-gray-600 font-medium">Réservation{reservations.length > 1 ? 's' : ''} active{reservations.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" padding="lg" hover>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 shadow-lg">
                            <Book size={32} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-600">
                                {maxLoans - reservations.length}
                            </p>
                            <p className="text-gray-600 font-medium">Places disponibles</p>
                        </div>
                    </div>
                </Card>

                <Card variant="glass" padding="lg" hover>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100 shadow-lg">
                            <Clock size={32} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-600">
                                {reservations.length > 0 ? Math.ceil(reservations.reduce((acc, r) =>
                                    acc + (Date.now() - r.reservedAt.getTime()), 0) / (1000 * 60 * 60 * 24 * reservations.length)) : 0}
                            </p>
                            <p className="text-gray-600 font-medium">Jours en moyenne</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Barre de recherche et actions */}
            <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Rechercher une réservation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search size={18} />}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={loadUserData}
                            className="cursor-pointer"
                        >
                            Actualiser
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Filter size={16} />}
                            className="cursor-pointer"
                        >
                            Filtres
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Liste des réservations */}
            {filteredReservations.length === 0 ? (
                <Card variant="elevated" padding="xl">
                    <div className="text-center py-12">
                        {searchTerm ? (
                            <>
                                <Search size={64} className="mx-auto text-gray-400 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucune réservation trouvée
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Aucune réservation ne correspond à votre recherche "{searchTerm}"
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                    className="cursor-pointer"
                                >
                                    Effacer la recherche
                                </Button>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucune réservation active
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Vous n'avez aucune réservation en cours. Explorez notre catalogue pour réserver des livres.
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/books')}
                                    leftIcon={<Book size={16} />}
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
                    {filteredReservations.map((reservation, index) => (
                        <Card key={`${reservation.id}-${index}`} variant="elevated" padding="lg" hover>
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Image du livre */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-44 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                        <img
                                            src={reservation.image}
                                            alt={reservation.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/api/placeholder/120/160';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Informations de la réservation */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                                    {reservation.name}
                                                </h3>
                                                <Badge variant="primary" size="sm">
                                                    Réservé
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag size={16} style={{ color: primaryColor }} />
                                                <span className="text-gray-600 font-medium">{reservation.category}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={16} />
                                                <span>Réservé {getTimeAgo(reservation.reservedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<Eye size={16} />}
                                            onClick={() => navigate(`/books/${reservation.id}`)}
                                            className="cursor-pointer"
                                        >
                                            Voir les détails
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={cancellingIds.has(reservation.id) ?
                                                <RefreshCw size={16} className="animate-spin" /> :
                                                <Trash2 size={16} />
                                            }
                                            onClick={() => handleCancelReservation(reservation)}
                                            disabled={cancellingIds.has(reservation.id)}
                                            className="cursor-pointer text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        >
                                            {cancellingIds.has(reservation.id) ? 'Annulation...' : 'Annuler la réservation'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Barre de progression (optionnelle) */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>Utilisation des emplacements</span>
                                    <span>{reservations.length}/{maxLoans}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(reservations.length / maxLoans) * 100}%`,
                                            backgroundColor: reservations.length >= maxLoans ? '#ef4444' : primaryColor
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Action globale */}
            {reservations.length > 0 && (
                <Card variant="glass" padding="lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Gestion des réservations
                            </h3>
                            <p className="text-sm text-gray-600">
                                Vous avez {reservations.length} réservation{reservations.length > 1 ? 's' : ''} active{reservations.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/books')}
                                leftIcon={<Book size={16} />}
                                className="cursor-pointer"
                            >
                                Ajouter plus
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.print()}
                                className="cursor-pointer"
                            >
                                Imprimer la liste
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ReservationsPage;
