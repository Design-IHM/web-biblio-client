// src/components/CategorySelector.jsx
import { Book, FileText } from 'lucide-react';

const CategorySelector = ({ onSelect, activeCategory }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div 
        onClick={() => onSelect('books')}
        className={`flex-1 cursor-pointer relative overflow-hidden rounded-xl shadow-lg group transition-all ${activeCategory === 'books' ? 'ring-4 ring-primary' : ''}`}
      >
        <div className="absolute inset-0 bg-secondary opacity-90 group-hover:opacity-95 transition-all"></div>
        <div className="relative p-6 text-white flex flex-col items-center justify-center text-center h-48">
          <Book size={44} className="mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Livres</h3>
          <p className="text-gray-200">Explorez notre collection complète de livres</p>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform transition-transform duration-300 ${activeCategory === 'books' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></div>
        </div>
      </div>
      
      <div 
        onClick={() => onSelect('memoirs')}
        className={`flex-1 cursor-pointer relative overflow-hidden rounded-xl shadow-lg group transition-all ${activeCategory === 'memoirs' ? 'ring-4 ring-primary' : ''}`}
      >
        <div className="absolute inset-0 bg-secondary opacity-90 group-hover:opacity-95 transition-all"></div>
        <div className="relative p-6 text-white flex flex-col items-center justify-center text-center h-48">
          <FileText size={44} className="mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Mémoires</h3>
          <p className="text-gray-200">Accédez à notre archive de mémoires académiques</p>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform transition-transform duration-300 ${activeCategory === 'memoirs' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;