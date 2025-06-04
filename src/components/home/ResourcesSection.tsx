import { useState, useEffect } from 'react';
import { Book, GraduationCap, ArrowRight, Calendar, User, Star, ExternalLink } from 'lucide-react';
import { collection, getDocs, limit, query, Timestamp } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';

// Types pour les commentaires
interface Comment {
    heure: Timestamp;
    nomUser: string;
    note: number;
    texte: string;
}

// Type pour les livres
interface BiblioBook {
    id: string;
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

// Type pour les mémoires
interface BiblioThesis {
    id: string;
    abstract: string;
    annee: number;
    commentaire: Comment[];
    département: string;
    etagere: string;
    image: string;
    keywords: string;
    matricule: string;
    name: string;
    pdfUrl: string;
    superviseur: string;
    theme: string;
}

const ResourcesSection: React.FC = () => {
    const { orgSettings } = useConfig();
    const [books, setBooks] = useState<BiblioBook[]>([]);
    const [theses, setTheses] = useState<BiblioThesis[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    useEffect(() => {
        const fetchResources = async (): Promise<void> => {
            try {
                // Récupérer les livres (limité à 8 pour l'affichage)
                const booksQuery = query(
                    collection(db, 'BiblioBooks'),
                    limit(8)
                );
                const booksSnapshot = await getDocs(booksQuery);
                const booksData: BiblioBook[] = booksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as BiblioBook));

                // Récupérer les mémoires (limité à 8 pour l'affichage)
                const thesesQuery = query(
                    collection(db, 'BiblioThesis'),
                    limit(8)
                );
                const thesesSnapshot = await getDocs(thesesQuery);
                const thesesData: BiblioThesis[] = thesesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as BiblioThesis));

                setBooks(booksData);
                setTheses(thesesData);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des ressources:', error);
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const BookCard: React.FC<{ book: BiblioBook }> = ({ book }) => {
        const available = book.exemplaire > 0;
        const totalRating = book.commentaire?.reduce((sum, comment) => sum + (comment.note || 0), 0) || 0;
        const avgRating = book.commentaire?.length > 0 ? (totalRating / book.commentaire.length).toFixed(1) : '0';

        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 group w-full">
                {/* Image container avec ratio fixe */}
                <div className="relative w-full h-72 overflow-hidden bg-gray-100">
                    <img
                        src={book.image || '/api/placeholder/320/360'}
                        alt={book.auteur}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/320/360';
                        }}
                    />

                    {/* Overlay gradient pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status badge - redesigné */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
                        available
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                    }`}>
                        {available ? `${book.exemplaire} dispo` : 'Emprunté'}
                    </div>

                    {/* Rating badge - repositionné */}
                    {parseFloat(avgRating) > 0 && (
                        <div className="absolute top-4 left-4 flex items-center bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs ml-1 font-medium">{avgRating}</span>
                        </div>
                    )}

                    {/* Catégorie badge en bas à gauche */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-700">{book.cathegorie}</span>
                    </div>
                </div>

                {/* Contenu de la card */}
                <div className="p-5">
                    {/* Titre du livre */}
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 leading-tight min-h-[3.5rem]">
                        {book.auteur}
                    </h3>

                    {/* Informations secondaires */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Édition</span>
                            <span className="font-medium text-gray-800">{book.edition}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Étagère</span>
                            <span className="font-medium text-gray-800">{book.etagere}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-5 leading-relaxed min-h-[4rem]">
                        {book.desc || "Description non disponible pour ce livre."}
                    </p>

                    {/* Bouton d'action */}
                    <div className="space-y-3">
                        <button
                            className="w-full py-3 rounded-xl text-white cursor-pointer font-semibold text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            style={{
                                backgroundColor: available ? primaryColor : '#6b7280',
                                boxShadow: available ? `0 4px 14px 0 ${primaryColor}40` : '0 4px 14px 0 rgba(107, 114, 128, 0.25)'
                            }}
                            disabled={!available}
                        >
                            {available ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Réserver maintenant
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Liste d'attente
                                </>
                            )}
                        </button>

                        <button className="w-full py-2 border cursor-pointer border-gray-200 rounded-xl text-gray-700 font-medium text-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-300">
                            Voir les détails
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ThesisCard: React.FC<{ thesis: BiblioThesis }> = ({ thesis }) => {
        const hasKeywords = thesis.keywords && thesis.keywords.trim().length > 0;
        const keywordsArray = hasKeywords ? thesis.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];

        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-800">{thesis.theme}</h3>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                <User className="w-3 h-3 mr-1" />
                                {thesis.name} ({thesis.matricule})
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {thesis.annee}
                            </div>
                        </div>

                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Disponible
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Département:</span>
                            <span className="font-medium text-gray-700">{thesis.département}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Superviseur:</span>
                            <span className="font-medium text-gray-700">{thesis.superviseur}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Étagère:</span>
                            <span className="font-medium text-gray-700">{thesis.etagere}</span>
                        </div>
                    </div>

                    {thesis.abstract && thesis.abstract.trim().length > 0 && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{thesis.abstract}</p>
                    )}

                    {keywordsArray.length > 0 && (
                        <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                                {keywordsArray.slice(0, 3).map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                    >
                    {keyword}
                  </span>
                                ))}
                                {keywordsArray.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    +{keywordsArray.length - 3}
                  </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            className="flex-1 py-2 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            style={{ backgroundColor: secondaryColor }}
                        >
                            Consulter
                        </button>
                        {thesis.pdfUrl && thesis.pdfUrl.trim().length > 0 && (
                            <button
                                className="px-3 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                style={{
                                    borderColor: primaryColor,
                                    color: primaryColor
                                }}
                                onClick={() => window.open(thesis.pdfUrl, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const LoadingSkeleton: React.FC<{ type?: 'book' | 'thesis' }> = ({ type = 'book' }) => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {type === 'book' ? (
                <>
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </>
            ) : (
                <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <section id="resources-section" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
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
                        <h2 className="text-4xl font-bold mb-6" style={{ color: secondaryColor }}>
                            Nos Ressources Académiques
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chargement des ressources depuis notre base de données...
                        </p>
                    </div>

                    {/* Loading Skeletons */}
                    <div className="mb-20">
                        <div className="flex items-center mb-8">
                            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <LoadingSkeleton key={i} type="book" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <LoadingSkeleton key={i} type="thesis" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="resources-section" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
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
                    <h2 className="text-4xl font-bold mb-6" style={{ color: secondaryColor }}>
                        Nos Ressources Académiques
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explorez notre vaste collection de livres académiques et de mémoires de recherche
                        pour enrichir vos connaissances et alimenter vos recherches.
                    </p>
                </div>

                {/* Books Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <Book className="w-6 h-6" style={{ color: primaryColor }} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                                    Livres Académiques
                                </h3>
                                <p className="text-gray-600">
                                    {books.length > 0 ? `${books.length} livre${books.length > 1 ? 's' : ''} disponible${books.length > 1 ? 's' : ''}` : 'Collection de livres spécialisés par domaine'}
                                </p>
                            </div>
                        </div>

                        <a
                            href="/catalogue?type=books"
                            className="flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            style={{
                                backgroundColor: `${primaryColor}10`,
                                color: primaryColor
                            }}
                        >
                            Voir tous les livres
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>

                    {books.length > 0 ? (
                        <>
                            {/* Grille principale - avec plus d'espace entre les colonnes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
                                {books.slice(0, 4).map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>

                            {/* Deuxième ligne si plus de 4 livres */}
                            {books.length > 4 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {books.slice(4, 8).map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <Book className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun livre trouvé</h3>
                            <p className="text-gray-600">Les livres seront affichés ici une fois ajoutés à la collection.</p>
                        </div>
                    )}
                </div>

                {/* Separator */}
                <div className="flex items-center justify-center mb-20">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
                    <div
                        className="mx-6 w-3 h-3 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
                </div>

                {/* Theses Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                style={{ backgroundColor: `${secondaryColor}15` }}
                            >
                                <GraduationCap className="w-6 h-6" style={{ color: secondaryColor }} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                                    Mémoires & Thèses
                                </h3>
                                <p className="text-gray-600">
                                    {theses.length > 0 ? `${theses.length} mémoire${theses.length > 1 ? 's' : ''} disponible${theses.length > 1 ? 's' : ''}` : 'Travaux de recherche et mémoires académiques'}
                                </p>
                            </div>
                        </div>

                        <a
                            href="/catalogue?type=theses"
                            className="flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            style={{
                                backgroundColor: `${secondaryColor}10`,
                                color: secondaryColor
                            }}
                        >
                            Voir tous les mémoires
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>

                    {theses.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {theses.slice(0, 4).map((thesis) => (
                                    <ThesisCard key={thesis.id} thesis={thesis} />
                                ))}
                            </div>

                            {theses.length > 4 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {theses.slice(4, 8).map((thesis) => (
                                        <ThesisCard key={thesis.id} thesis={thesis} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun mémoire trouvé</h3>
                            <p className="text-gray-600">Les mémoires seront affichés ici une fois ajoutés à la collection.</p>
                        </div>
                    )}
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
                            Besoin d'aide pour trouver une ressource ?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Notre équipe est là pour vous accompagner dans vos recherches académiques.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Contacter un bibliothécaire
                            </a>
                            <a
                                href="/catalogue"
                                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 border-2"
                                style={{
                                    borderColor: secondaryColor,
                                    color: secondaryColor
                                }}
                            >
                                Recherche avancée
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResourcesSection;
