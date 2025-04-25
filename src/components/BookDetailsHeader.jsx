// src/components/BookDetailsHeader.jsx
import { Star, Clock, ChevronLeft, Share2, Bookmark, Download, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookDetailsHeader = ({ book }) => {
  const { title, author, coverImg, rating, year, type, isAvailable, pages, publisher } = book;
  
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-secondary opacity-95"></div>
      
      <div className="relative pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-white mb-6 hover:text-primary transition-colors">
          <ChevronLeft size={20} className="mr-2" />
          Retour au catalogue
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-64 flex-shrink-0 z-10 mx-auto md:mx-0">
            <div className="relative group">
              <img 
                src={coverImg || "/api/placeholder/300/450"} 
                alt={title}
                className="w-full h-auto rounded-lg shadow-xl object-cover"
              />
              {!isAvailable && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                  Indisponible
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                <button className="bg-primary text-white px-4 py-2 rounded-full flex items-center font-medium">
                  <BookOpen size={18} className="mr-2" />
                  {isAvailable ? 'Lire maintenant' : 'Ajouter à ma liste d\'attente'}
                </button>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
                <Bookmark size={20} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
                <Download size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 text-white z-10 pt-4">
            <div className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4">
              {type === 'book' ? 'Livre' : 'Mémoire'}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-xl text-gray-200 mb-6">par {author}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-gray-300 text-sm">Année</p>
                <p className="font-medium">{year}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Pages</p>
                <p className="font-medium">{pages}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Éditeur</p>
                <p className="font-medium">{publisher}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Note</p>
                <div className="flex items-center">
                  <Star size={18} className="text-primary mr-1" fill="#ff8c00" />
                  <span className="font-medium">{rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            
            {isAvailable ? (
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center">
                <BookOpen size={18} className="mr-2" />
                Lire maintenant
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center">
                  Réserver
                </button>
                <div className="flex items-center text-gray-300">
                  <Clock size={18} className="mr-2" />
                  <span>Disponible dans ~3 jours</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsHeader;

