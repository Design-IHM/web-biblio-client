// src/components/AvailableItems.jsx
import { useState } from 'react';
import BookCard from './BookCard';
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

const AvailableItems = ({ items }) => {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="my-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          <span className="border-b-4 border-primary pb-1">Catalogue disponible</span>
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Trier par: Popularité</option>
            <option>Date: Plus récent</option>
            <option>Date: Plus ancien</option>
            <option>Titre: A-Z</option>
            <option>Titre: Z-A</option>
          </select>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map(item => (
            <BookCard key={item.id} item={item} size="normal" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-24 sm:w-32 flex-shrink-0">
                <img 
                  src={item.coverImg || "/api/placeholder/150/200"} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 hover:text-primary">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.author}</p>
                  </div>
                  <div className="text-sm text-gray-500">{item.year}</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${item.type === 'book' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      {item.type === 'book' ? 'Livre' : 'Mémoire'}
                    </span>
                    <div className="flex items-center ml-2">
                      <Star size={14} className="text-primary mr-1" fill="#ff8c00" />
                      <span className="text-xs">{item.rating}/5</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3, 4, 5].map(page => (
            <button 
              key={page}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${page === 1 ? 'bg-primary text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AvailableItems;