import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    Heart,
    ShoppingCart,
    CheckCircle,
    AlertCircle,
    BookOpen,
    User,
    Building,
    Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {Timestamp} from "firebase/firestore";

// Structure selon votre base de données
export interface Comment {
    heure: Timestamp;
    nomUser: string;
    note: number;
    texte: string;
}

export interface CommentWithUserData extends Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    helpful?: number;
}

export interface BiblioBook {
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

interface BookCardProps {
    book: BiblioBook;
    viewMode?: 'grid' | 'list';
    onReserve?: (bookId: string) => void;
    onToggleFavorite?: (bookId: string) => void;
    isFavorite?: boolean;
    isLoading?: boolean;
    className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
                                               book,
                                               viewMode = 'grid',
                                               onReserve,
                                               onToggleFavorite,
                                               isFavorite = false,
                                               isLoading = false,
                                               className = ""
                                           }) => {
    const { orgSettings } = useConfig();
    const [imageError, setImageError] = useState(false);
    const [isReserving, setIsReserving] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    // Gérer la réservation
    const handleReserve = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!onReserve || book.exemplaire === 0) return;

        setIsReserving(true);
        try {
            await onReserve(book.id);
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
        } finally {
            setIsReserving(false);
        }
    };

    // Gérer les favoris
    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onToggleFavorite) {
            onToggleFavorite(book.id);
        }
    };

    // Calculer les statistiques de disponibilité
    const isAvailable = book.exemplaire > 0;
    const availabilityPercentage = (book.exemplaire / book.initialExemplaire) * 100;

    // Déterminer la couleur de la barre de disponibilité
    const getAvailabilityColor = () => {
        if (availabilityPercentage > 50) return '#10b981';
        if (availabilityPercentage > 20) return '#f59e0b';
        return '#ef4444'; // Rouge
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Vue grille (par défaut)
    if (viewMode === 'grid') {
        return (
            <div className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
                <Link to={`/books/${book.id}`} className="block">
                    {/* Image de couverture */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        {book.image && !imageError ? (
                            <img
                                src={book.image}
                                alt={`Couverture de ${book.name}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={handleImageError}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <BookOpen className="w-16 h-16 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 text-center px-2">
                                    {book.image ? 'Image non disponible' : 'Pas d\'image'}
                                </span>
                            </div>
                        )}

                        {/* Badge de disponibilité */}
                        <div className="absolute top-2 left-2 z-20">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md ${
                                isAvailable
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                                {isAvailable ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                )}
                                {isAvailable ? `${book.exemplaire} dispo` : 'Épuisé'}
                            </div>
                        </div>

                        {/* Bouton favori */}
                        <button
                            onClick={handleToggleFavorite}
                            className={`absolute top-2 cursor-pointer right-2 p-2 rounded-full transition-all duration-200 z-20 shadow-md ${
                                isFavorite
                                    ? 'bg-red-100 text-red-600 border border-red-200'
                                    : 'bg-white bg-opacity-90 text-gray-600 hover:bg-white hover:bg-opacity-100 border border-gray-200'
                            }`}
                            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        {/* Badge d'étagère */}
                        {book.etagere && (
                            <div className="absolute bottom-2 right-2 z-10">
                                <div className="px-2 py-1 rounded-full bg-black bg-opacity-60 text-white text-xs font-medium">
                                    Ét: {book.etagere}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                        {/* Titre */}
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {book.name}
                        </h3>

                        {/* Auteur */}
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <User className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{book.auteur}</span>
                        </div>

                        {/* Catégorie */}
                        <div className="mb-3">
                            <span
                                className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${primaryColor}10`,
                                    color: primaryColor
                                }}
                            >
                                {book.cathegorie}
                            </span>
                        </div>

                        {/* Édition */}
                        {book.edition && (
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <Building className="w-3 h-3 mr-1" />
                                <span className="truncate">{book.edition}</span>
                            </div>
                        )}

                        {/* Barre de disponibilité */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Disponibilité</span>
                                <span>{book.exemplaire}/{book.initialExemplaire}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${availabilityPercentage}%`,
                                        backgroundColor: getAvailabilityColor()
                                    }}
                                />
                            </div>
                        </div>

                        {/* Nombre de commentaires */}
                        {book.commentaire && book.commentaire.length > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                                <span>{book.commentaire.length} commentaire{book.commentaire.length > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Actions */}
                <div className="p-4 pt-0">
                    <button
                        onClick={handleReserve}
                        disabled={!isAvailable || isReserving || isLoading}
                        className={`w-full py-2 px-4 cursor-pointer rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                            isAvailable && !isReserving && !isLoading
                                ? 'text-white hover:shadow-lg transform hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{
                            backgroundColor: isAvailable && !isReserving && !isLoading ? primaryColor : undefined
                        }}
                    >
                        {isReserving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Réservation...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {isAvailable ? 'Réserver' : 'Épuisé'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Vue liste
    return (
        <div className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
            <Link to={`/books/${book.id}`} className="flex">
                {/* Image de couverture */}
                <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                    {book.image && !imageError ? (
                        <img
                            src={book.image}
                            alt={`Couverture de ${book.name}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                    )}

                    {/* Badge de disponibilité */}
                    <div className="absolute bottom-1 left-1">
                        <div className={`w-3 h-3 rounded-full ${
                            isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                    </div>

                    {/* Badge d'étagère */}
                    {book.etagere && (
                        <div className="absolute top-1 right-1">
                            <div className="px-1 py-0.5 rounded text-xs bg-black bg-opacity-60 text-white font-medium">
                                {book.etagere}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenu */}
                <div className="flex-1 p-4 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 mr-4">
                            {/* Titre */}
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors">
                                {book.name}
                            </h3>

                            {/* Auteur */}
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <User className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{book.auteur}</span>
                            </div>

                            {/* Édition et étagère */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                {book.edition && (
                                    <div className="flex items-center">
                                        <Building className="w-3 h-3 mr-1" />
                                        <span className="truncate">{book.edition}</span>
                                    </div>
                                )}
                                {book.etagere && (
                                    <div className="flex items-center">
                                        <Package className="w-3 h-3 mr-1" />
                                        <span>Étagère: {book.etagere}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {book.desc && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                    {book.desc}
                                </p>
                            )}

                            {/* Catégorie et disponibilité */}
                            <div className="flex items-center gap-3 mb-2">
                                <span
                                    className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: `${primaryColor}10`,
                                        color: primaryColor
                                    }}
                                >
                                    {book.cathegorie}
                                </span>

                                <span className="text-xs text-gray-500 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {book.exemplaire}/{book.initialExemplaire} disponibles
                                </span>

                                {book.commentaire && book.commentaire.length > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                        {book.commentaire.length} avis
                                    </span>
                                )}
                            </div>

                            {/* Barre de disponibilité compacte */}
                            <div className="w-full max-w-xs">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${availabilityPercentage}%`,
                                            backgroundColor: getAvailabilityColor()
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
                                    isFavorite
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>

                            <button
                                onClick={handleReserve}
                                disabled={!isAvailable || isReserving || isLoading}
                                className={`py-2 px-4 rounded-lg cursor-pointer font-medium transition-all duration-200 flex items-center ${
                                    isAvailable && !isReserving && !isLoading
                                        ? 'text-white hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                style={{
                                    backgroundColor: isAvailable && !isReserving && !isLoading ? primaryColor : undefined
                                }}
                            >
                                {isReserving ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        <span className="hidden sm:inline">Réservation...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">
                                            {isAvailable ? 'Réserver' : 'Épuisé'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BookCard;
