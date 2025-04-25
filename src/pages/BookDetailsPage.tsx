// src/pages/BookDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookDetailsHeader from '../components/BookDetailsHeader';
import BookDetailsTabs from '../components/BookDetailsTabs';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Here you would fetch the book details from your API
    // This is a mock implementation
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        // For demo purposes - replace this with your actual API call
        // Example: const response = await fetch(`/api/books/${id}`);
        // const data = await response.json();
        
        // Simulating API response with timeout
        setTimeout(() => {
          // Mock data for demonstration
          const mockBook = {
            id: id,
            title: "Le Comte de Monte-Cristo",
            author: "Alexandre Dumas",
            coverImg: "/api/placeholder/300/450",
            rating: 4.7,
            year: "1844",
            type: "book",
            isAvailable: true,
            pages: 1276,
            publisher: "Gallimard",
            summary: "Edmond Dantès, injustement emprisonné au château d'If, s'évade après quatorze ans et, ayant hérité d'un trésor caché dans l'île de Monte-Cristo, se fait passer pour le comte de Monte-Cristo afin d'accomplir sa vengeance...",
            tags: ["Classique", "Aventure", "Vengeance", "Historique"],
            isbn: "978-2070413119",
            language: "Français",
            originalTitle: "Le Comte de Monte-Cristo",
            format: "Numérique et papier",
            publicationDate: "1844-1846",
            edition: "Édition critique",
            collection: "Folio Classique",
            tableOfContents: [
              "Chapitre I : Marseille — L'arrivée",
              "Chapitre II : Le père et le fils",
              "Chapitre III : Les Catalans",
              "Chapitre IV : Complot",
              "Chapitre V : Le repas des fiançailles"
            ],
            reviews: [
              {
                userName: "Marie Leclerc",
                userAvatar: "/api/placeholder/40/40",
                rating: 5,
                date: "12 mars 2023",
                comment: "Un chef-d'œuvre absolu de la littérature française. L'intrigue est parfaitement construite et les personnages sont inoubliables.",
                helpful: 24,
                replies: [
                  {
                    userName: "Paul Durand",
                    userAvatar: "/api/placeholder/32/32",
                    date: "15 mars 2023",
                    comment: "Totalement d'accord ! C'est mon roman préféré de tous les temps."
                  }
                ]
              },
              {
                userName: "Thomas Martin",
                userAvatar: "/api/placeholder/40/40",
                rating: 4,
                date: "27 février 2023",
                comment: "Excellent roman d'aventure, même si certains passages sont un peu longs.",
                helpful: 11
              }
            ],
            comments: [
              {
                userName: "Sophie Bernard",
                userAvatar: "/api/placeholder/40/40",
                date: "5 avril 2023",
                text: "Je viens de terminer le chapitre 27 et je suis complètement captivée par l'intrigue !",
                likes: 8,
                replies: [
                  {
                    userName: "Julie Moreau",
                    userAvatar: "/api/placeholder/32/32",
                    date: "6 avril 2023",
                    text: "Attends de voir la suite, c'est encore mieux !",
                    likes: 3
                  }
                ]
              }
            ]
          };
          
          setBook(mockBook);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        setError("Impossible de charger les détails du livre. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Livre non trouvé</h2>
          <p className="text-gray-600">Le livre que vous recherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BookDetailsHeader book={book} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookDetailsTabs book={book} />
      </div>
    </div>
  );
};

export default BookDetailsPage;