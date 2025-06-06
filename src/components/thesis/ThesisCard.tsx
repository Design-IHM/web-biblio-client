import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    Heart,
    Eye,
    GraduationCap,
    User,
    Calendar,
    Package,
    ExternalLink,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BiblioThesis } from '../../types/thesis';

export type ViewMode = 'grid' | 'list';

interface ThesisCardProps {
    thesis: BiblioThesis;
    viewMode?: ViewMode;
    onView?: (thesisId: string) => void;
    onToggleFavorite?: (thesisId: string) => void;
    isFavorite?: boolean;
    isLoading?: boolean;
    className?: string;
}

const ThesisCard: React.FC<ThesisCardProps> = ({
                                                   thesis,
                                                   viewMode = 'grid',
                                                   onView,
                                                   onToggleFavorite,
                                                   isFavorite = false,
                                                   isLoading = false,
                                                   className = ""
                                               }) => {
    const { orgSettings } = useConfig();
    const [imageError, setImageError] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    // Gérer la consultation
    const handleView = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!onView) return;

        setIsViewing(true);
        try {
            await onView(thesis.id);
        } catch (error) {
            console.error('Erreur lors de la consultation:', error);
        } finally {
            setIsViewing(false);
        }
    };

    // Gérer les favoris
    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onToggleFavorite) {
            onToggleFavorite(thesis.id);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Calculer la note moyenne
    const averageRating = thesis.commentaire.length > 0
        ? thesis.commentaire.reduce((sum, comment) => sum + comment.note, 0) / thesis.commentaire.length
        : 0;

    // Traiter les mots-clés
    const keywords = thesis.keywords
        ? thesis.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 3)
        : [];

    // Vue grille (par défaut)
    if (viewMode === 'grid') {
        return (
            <div className={`group bg-white cursor-pointer rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
                <Link to={`/thesis/${thesis.id}`} className="block">
                    {/* Image de couverture */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        {thesis.image && !imageError ? (
                            <img
                                src={thesis.image}
                                alt={`Mémoire de ${thesis.name}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={handleImageError}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <GraduationCap className="w-16 h-16 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 text-center px-2">
                                    {thesis.image ? 'Image non disponible' : 'Pas d\'image'}
                                </span>
                            </div>
                        )}

                        {/* Badge d'année */}
                        <div className="absolute top-2 left-2 z-20">
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-md">
                                <Calendar className="w-3 h-3 mr-1 inline" />
                                {thesis.annee}
                            </div>
                        </div>

                        {/* Bouton favori */}
                        <button
                            onClick={handleToggleFavorite}
                            className={`absolute cursor-pointer top-2 right-2 p-2 rounded-full transition-all duration-200 z-20 shadow-md ${
                                isFavorite
                                    ? 'bg-red-100 text-red-600 border border-red-200'
                                    : 'bg-white bg-opacity-90 text-gray-600 hover:bg-white hover:bg-opacity-100 border border-gray-200'
                            }`}
                            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        {/* Note moyenne */}
                        {averageRating > 0 && (
                            <div className="absolute bottom-2 left-2 z-10">
                                <div className="px-2 py-1 rounded-full bg-black bg-opacity-60 text-white text-xs font-medium flex items-center">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                    {averageRating.toFixed(1)}
                                </div>
                            </div>
                        )}

                        {/* Badge d'étagère */}
                        {thesis.etagere && (
                            <div className="absolute bottom-2 right-2 z-10">
                                <div className="px-2 py-1 rounded-full bg-black bg-opacity-60 text-white text-xs font-medium">
                                    Ét: {thesis.etagere}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                        {/* Titre du mémoire (theme ou matricule) */}
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {thesis.theme || `Mémoire ${thesis.matricule}`}
                        </h3>

                        {/* Auteur */}
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <User className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{thesis.name}</span>
                        </div>

                        {/* Matricule */}
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                            <span className="font-medium">Matricule: {thesis.matricule}</span>
                        </div>

                        {/* Département */}
                        <div className="mb-3">
                            <span
                                className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${primaryColor}10`,
                                    color: primaryColor
                                }}
                            >
                                {thesis.département}
                            </span>
                        </div>

                        {/* Superviseur si disponible */}
                        {thesis.superviseur && (
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <User className="w-3 h-3 mr-1" />
                                <span className="truncate">Sup: {thesis.superviseur}</span>
                            </div>
                        )}

                        {/* Mots-clés */}
                        {keywords.length > 0 && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                    {keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Étagère */}
                        {thesis.etagere && (
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <Package className="w-3 h-3 mr-1" />
                                <span>Étagère: {thesis.etagere}</span>
                            </div>
                        )}

                        {/* Nombre de commentaires */}
                        {thesis.commentaire && thesis.commentaire.length > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                                <span>{thesis.commentaire.length} commentaire{thesis.commentaire.length > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Actions */}
                <div className="p-4 pt-0">
                    <div className="flex gap-2">
                        <button
                            onClick={handleView}
                            disabled={isViewing || isLoading}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-white hover:shadow-lg transform hover:scale-[1.02]`}
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isViewing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Reservation...
                                </>
                            ) : (
                                <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Reserver
                                </>
                            )}
                        </button>

                        {thesis.pdfUrl && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(thesis.pdfUrl, '_blank');
                                }}
                                className="px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                                style={{
                                    borderColor: secondaryColor,
                                    color: secondaryColor
                                }}
                                title="Ouvrir le PDF"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Vue liste
    return (
        <div className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
            <Link to={`/thesis/${thesis.id}`} className="flex">
                {/* Image de couverture */}
                <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                    {thesis.image && !imageError ? (
                        <img
                            src={thesis.image}
                            alt={`Mémoire de ${thesis.name}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <GraduationCap className="w-8 h-8 text-gray-400" />
                        </div>
                    )}

                    {/* Badge d'année */}
                    <div className="absolute bottom-1 left-1">
                        <div className="px-1 py-0.5 rounded text-xs bg-blue-500 text-white font-medium">
                            {thesis.annee}
                        </div>
                    </div>

                    {/* Note moyenne */}
                    {averageRating > 0 && (
                        <div className="absolute top-1 right-1">
                            <div className="px-1 py-0.5 rounded text-xs bg-black bg-opacity-60 text-white font-medium flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                {averageRating.toFixed(1)}
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
                                {thesis.theme || `Mémoire ${thesis.matricule}`}
                            </h3>

                            {/* Auteur et matricule */}
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <User className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{thesis.name} ({thesis.matricule})</span>
                            </div>

                            {/* Informations secondaires */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span>{thesis.annee}</span>
                                </div>
                                {thesis.superviseur && (
                                    <div className="flex items-center">
                                        <User className="w-3 h-3 mr-1" />
                                        <span className="truncate">Sup: {thesis.superviseur}</span>
                                    </div>
                                )}
                                {thesis.etagere && (
                                    <div className="flex items-center">
                                        <Package className="w-3 h-3 mr-1" />
                                        <span>Ét: {thesis.etagere}</span>
                                    </div>
                                )}
                            </div>

                            {/* Abstract */}
                            {thesis.abstract && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                                    {thesis.abstract}
                                </p>
                            )}

                            {/* Département et mots-clés */}
                            <div className="flex items-center gap-3 mb-2">
                                <span
                                    className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: `${primaryColor}10`,
                                        color: primaryColor
                                    }}
                                >
                                    {thesis.département}
                                </span>

                                {thesis.commentaire && thesis.commentaire.length > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                        {thesis.commentaire.length} avis
                                    </span>
                                )}
                            </div>

                            {/* Mots-clés */}
                            {keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            )}
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
                                onClick={handleView}
                                disabled={isViewing || isLoading}
                                className={`py-2 px-4 rounded-lg cursor-pointer font-medium transition-all duration-200 flex items-center text-white hover:shadow-lg`}
                                style={{ backgroundColor: primaryColor }}
                            >
                                {isViewing ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        <span className="hidden sm:inline">Reservation...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Reserver</span>
                                    </>
                                )}
                            </button>

                            {thesis.pdfUrl && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(thesis.pdfUrl, '_blank');
                                    }}
                                    className="px-3 py-2 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg"
                                    style={{
                                        borderColor: secondaryColor,
                                        color: secondaryColor
                                    }}
                                    title="Ouvrir le PDF"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ThesisCard;
