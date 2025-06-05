import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { authService } from '../services/auth/authService';
import { BiblioUser } from '../types/auth';
import { Timestamp, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebase';

// Import des composants
import BookHeader from '../components/books/BookHeader';
import BookDescription from '../components/books/BookDescription';
import CommentsSection from '../components/books/CommentsSection';
import CommentModal from '../components/books/CommentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import des interfaces depuis BookCard
import { BiblioBook, Comment, CommentWithUserData } from '../components/books/BookCard';

const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orgSettings } = useConfig();

    // États principaux
    const [book, setBook] = useState<BiblioBook | null>(null);
    const [commentsWithUserData, setCommentsWithUserData] = useState<CommentWithUserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<BiblioUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // États pour les interactions
    const [isFavorite, setIsFavorite] = useState(false);
    const [isReserving, setIsReserving] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    // Charger les données utilisateur
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Erreur chargement utilisateur:', error);
            }
        };

        loadUserData();
    }, [id]);

    // Fonction pour récupérer les données utilisateur d'un commentaire
    const getUserDataForComment = async (nomUser: string): Promise<{ userName: string; userAvatar?: string }> => {
        try {
            // Si nomUser correspond à un nom d'utilisateur, essayez de récupérer l'avatar
            // Ici vous pourriez faire une requête pour chercher l'utilisateur par nom
            // Pour l'instant, on retourne juste le nomUser
            return {
                userName: nomUser || 'Utilisateur anonyme',
                userAvatar: undefined // Vous pouvez implémenter la logique pour récupérer l'avatar
            };
        } catch (error) {
            console.error('Erreur récupération données utilisateur:', error);
            return { userName: nomUser || 'Utilisateur anonyme' };
        }
    };

    // Charger les commentaires avec les données utilisateur
    const loadCommentsWithUserData = async (comments: Comment[]) => {
        setLoadingComments(true);

        try {
            const commentsWithData = await Promise.all(
                comments.map(async (comment, index) => {
                    const userData = await getUserDataForComment(comment.nomUser);
                    return {
                        ...comment,
                        id: `comment_${index}_${comment.heure.toMillis()}`, // ID unique pour React
                        userId: comment.nomUser, // Utilise nomUser comme userId temporaire
                        userName: userData.userName,
                        userAvatar: userData.userAvatar,
                        helpful: 0 // Valeur par défaut pour le système de votes
                    } as CommentWithUserData;
                })
            );

            setCommentsWithUserData(commentsWithData);
        } catch (error) {
            console.error('Erreur chargement commentaires:', error);
            setCommentsWithUserData([]);
        } finally {
            setLoadingComments(false);
        }
    };

    // Charger les données du livre depuis Firebase
    useEffect(() => {
        const fetchBookData = async () => {
            if (!id) {
                setError('ID du livre manquant');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Récupérer le livre depuis Firestore
                const bookDoc = await getDoc(doc(db, 'BiblioBooks', id));

                if (!bookDoc.exists()) {
                    setError('Livre introuvable dans la base de données');
                    setLoading(false);
                    return;
                }

                const bookData = { id: bookDoc.id, ...bookDoc.data() } as BiblioBook;
                setBook(bookData);

                // Charger les commentaires avec les données utilisateur
                if (bookData.commentaire && bookData.commentaire.length > 0) {
                    await loadCommentsWithUserData(bookData.commentaire);
                } else {
                    console.log('📝 Aucun commentaire pour ce livre');
                    setCommentsWithUserData([]);
                }

            } catch {
                setError('Impossible de charger les détails du livre. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [id]);

    // Gestion de la réservation
    const handleReserve = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (!book || book.exemplaire <= 0) {
            return;
        }

        setIsReserving(true);

        try {
            // Mettre à jour le nombre d'exemplaires dans Firestore
            const bookRef = doc(db, 'BiblioBook', book.id);
            await updateDoc(bookRef, {
                exemplaire: book.exemplaire - 1
            });

            // Mettre à jour l'état local
            setBook(prev => prev ? {
                ...prev,
                exemplaire: prev.exemplaire - 1
            } : null);

            // TODO: Ajouter la réservation à l'utilisateur

        } catch (error) {
            console.error('❌ Erreur réservation:', error);
            alert('Erreur lors de la réservation. Veuillez réessayer.');
        } finally {
            setIsReserving(false);
        }
    };

    // Gestion des favoris
    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        try {
            setIsFavorite(!isFavorite);

            const message = isFavorite
                ? 'Livre retiré des favoris'
                : 'Livre ajouté aux favoris';
            console.log(message);

        } catch (error) {
            console.error('❌ Erreur favoris:', error);
        }
    };

    // Gestion des commentaires
    const handleSubmitComment = async (commentData: { texte: string; note: number; nomUser: string }) => {
        if (!isAuthenticated || !currentUser || !book) {
            throw new Error('Non authentifié');
        }

        try {
            const newComment: Comment = {
                heure: Timestamp.now(),
                nomUser: commentData.nomUser,
                note: commentData.note,
                texte: commentData.texte
            };

            // Ajouter le commentaire au livre dans Firestore
            const bookRef = doc(db, 'BiblioBooks', book.id);
            await updateDoc(bookRef, {
                commentaire: arrayUnion(newComment)
            });

            // Mettre à jour l'état local du livre
            setBook(prev => prev ? {
                ...prev,
                commentaire: [newComment, ...prev.commentaire]
            } : null);

            // Créer le commentaire avec données utilisateur pour l'affichage
            const newCommentWithUserData: CommentWithUserData = {
                ...newComment,
                id: `comment_new_${Date.now()}`,
                userId: currentUser.id || '',
                userName: currentUser.name,
                userAvatar: currentUser.profilePicture,
                helpful: 0
            };

            // Mettre à jour l'état local des commentaires avec données utilisateur
            setCommentsWithUserData(prev => [newCommentWithUserData, ...prev]);

        } catch (error) {
            console.error('❌ Erreur ajout commentaire:', error);
            throw error;
        }
    };

    // Gestion des votes "utile"
    const handleHelpfulClick = async (commentId: string) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        try {
            setCommentsWithUserData(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? { ...comment, helpful: (comment.helpful || 0) + 1 }
                        : comment
                )
            );

        } catch (error) {
            console.error('❌ Erreur vote utile:', error);
        }
    };

    const handleLoginRequired = () => {
        navigate('/auth');
    };

    // États de chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner
                    size="xl"
                    text="Chargement des détails du livre..."
                    fullScreen
                />
            </div>
        );
    }

    // Gestion des erreurs
    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                    >
                        <svg
                            className="w-8 h-8"
                            style={{ color: primaryColor }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: secondaryColor }}>
                        Livre introuvable
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || 'Le livre que vous recherchez n\'existe pas ou a été supprimé.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-6 py-3 cursor-pointer rounded-lg font-medium text-white transition-colors"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Réessayer
                        </button>
                        <button
                            onClick={() => navigate('/books')}
                            className="flex-1 px-6 py-3 cursor-pointer rounded-lg font-medium border-2 transition-colors"
                            style={{
                                borderColor: primaryColor,
                                color: primaryColor
                            }}
                        >
                            Retour au catalogue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                        >
                            Accueil
                        </button>
                        <span className="text-gray-400">/</span>
                        <button
                            onClick={() => navigate('/books')}
                            className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                        >
                            Catalogue
                        </button>
                        <span className="text-gray-400">/</span>
                        <span style={{ color: primaryColor }} className="font-medium">
                            {book.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* En-tête du livre */}
                    <BookHeader
                        book={book}
                        onReserve={handleReserve}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenCommentModal={() => setIsCommentModalOpen(true)}
                        isFavorite={isFavorite}
                        isAuthenticated={isAuthenticated}
                        isReserving={isReserving}
                        commentsWithUserData={commentsWithUserData}
                    />

                    {/* Description du livre */}
                    <BookDescription book={book} />

                    {/* Section des commentaires */}
                    <div className="relative">
                        {loadingComments && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                                <LoadingSpinner size="md" text="Chargement des commentaires..." />
                            </div>
                        )}

                        <CommentsSection
                            comments={commentsWithUserData}
                            onOpenCommentModal={() => setIsCommentModalOpen(true)}
                            onHelpfulClick={handleHelpfulClick}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de commentaire */}
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                onSubmit={handleSubmitComment}
                bookTitle={book.name}
                isAuthenticated={isAuthenticated}
                onLoginRequired={handleLoginRequired}
                currentUserName={currentUser?.name || ''}
            />

            {/* Bouton flottant de retour */}
            <button
                onClick={() => navigate('/books')}
                className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-xl text-white flex items-center justify-center transition-all duration-200 hover:shadow-2xl hover:scale-110 z-50"
                style={{ backgroundColor: secondaryColor }}
                title="Retour au catalogue"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    );
};

export default BookDetailsPage;
