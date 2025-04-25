import SearchBar from '../components/SearchBar';
import CategorySelector from '../components/CategorySelector';
import AvailableItems from '../components/AvailableItems';
import PopularBooks from '../components/PopularBooks';
import SimilarBooks from '../components/SimilarBooks';
import UserRecommendations from '../components/UserRecommendations';

const dummyData = [
    {
      id: '1',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      year: 1943,
      coverImg: 'https://picsum.photos/150/200?random=1',
      type: 'book',
      rating: 4.7,
      isAvailable: true,
    },
    {
      id: '2',
      title: 'L’Étranger',
      author: 'Albert Camus',
      year: 1942,
      coverImg: 'https://picsum.photos/150/200?random=2',
      type: 'book',
      rating: 4.5,
      isAvailable: false,
    },
    {
      id: '3',
      title: 'Les Misérables',
      author: 'Victor Hugo',
      year: 1862,
      coverImg: 'https://picsum.photos/150/200?random=3',
      type: 'book',
      rating: 4.9,
      isAvailable: true,
    },
    {
      id: '4',
      title: 'Mémoire sur l’IA',
      author: 'Jean Dupont',
      year: 2021,
      coverImg: 'https://picsum.photos/150/200?random=4',
      type: 'memoire',
      rating: 4.2,
      isAvailable: true,
    },
    {
      id: '5',
      title: 'Mémoire en cybersécurité',
      author: 'Claire Mbarga',
      year: 2022,
      coverImg: 'https://picsum.photos/150/200?random=5',
      type: 'memoire',
      rating: 4.6,
      isAvailable: false,
    },
  ];
  
  
  

const CataloguePage = () => {
  // Sample data for the announcements carousel
  const annoncesData = [
    {
      id: 1,
      title: "Nouveaux arrivages",
      description: "Découvrez notre collection de nouveaux livres disponibles dès maintenant dans toutes nos bibliothèques.",
      image: "nouveaux-arrivages.jpg"
    },
    {
      id: 2,
      title: "Événement littéraire",
      description: "Rencontre avec l'auteur Marc Lévy le 15 avril à 18h dans notre bibliothèque centrale.",
      image: "evenement-litteraire.jpg"
    },
    {
      id: 3,
      title: "Promotion d'été",
      description: "50% de réduction sur les abonnements premium pendant tout le mois de juillet.",
      image: "promotion-ete.jpg"
    },
    {
      id: 4,
      title: "Atelier d'écriture",
      description: "Participez à notre atelier d'écriture créative tous les samedis matin de 10h à 12h.",
      image: "atelier-ecriture.jpg"
    }
  ];

  return (
    <>

    <div className="flex flex-col min-h-screen container mx-auto px-4 py-8">
      
      <main className="flex-grow">
        <SearchBar />
        <CategorySelector/>
        <PopularBooks books={dummyData.slice(0, 4)} />
        <AvailableItems items={dummyData} />      
        <SimilarBooks books={dummyData.slice(0, 4)}/>
        <UserRecommendations recommendations={dummyData.slice(0, 4)}/>
        
        
          
      </main>
      
    </div>
    </>
  );
};

export default CataloguePage;