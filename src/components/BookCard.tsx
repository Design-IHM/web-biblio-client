// src/components/BookCard.jsx
import { Star, Bookmark, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookCard = ({ item, size = "normal" }) => {
  const { id, title, author, coverImg, rating, year, type, isAvailable } = item;
  
  // Styles selon la taille
  const sizeClasses = {
    small: "w-48",
    normal: "w-64",
    large: "w-72"
  };
  
  return (
    <Link 
      to={`/${type}/${id}`} 
      className={`${sizeClasses[size]} group flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white`}
    >
      <div className="relative h-80 overflow-hidden">
        <img 
          src={coverImg || "/api/placeholder/300/400"} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!isAvailable && (
          <div className="absolute top-0 right-0 bg-gray-700 text-white px-3 py-1 text-xs font-medium">
            Indisponible
          </div>
        )}
        <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded text-xs">
          {type === 'book' ? 'Livre' : 'Mémoire'}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm flex items-center">
            <BookOpen size={16} className="mr-2" />
            Voir les détails
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <button className="text-gray-400 hover:text-primary transition-colors">
            <Bookmark size={18} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <Star size={16} className="text-primary mr-1" fill="#ff8c00" />
            <span className="text-sm font-medium">{rating}/5</span>
          </div>
          <span className="text-sm text-gray-500">{year}</span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;