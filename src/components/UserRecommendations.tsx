// src/components/UserRecommendations.jsx
import BookCard from './BookCard';

const UserRecommendations = ({ recommendations }) => {
  return (
    <div className="bg-secondary rounded-2xl p-6 my-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 sm:mb-0">
          Recommandé pour vous
        </h2>
        <div className="flex items-center text-gray-300 text-sm">
          <span className="mr-2">Basé sur vos lectures précédentes</span>
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map(item => (
          <BookCard key={item.id} item={item} size="normal" />
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 rounded-md bg-primary text-white font-medium hover:bg-opacity-90 transition-all">
          Voir toutes les recommandations
        </button>
      </div>
    </div>
  );
};

export default UserRecommendations;
