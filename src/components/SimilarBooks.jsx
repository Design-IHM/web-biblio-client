// src/components/SimilarBooks.jsx
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const SimilarBooks = ({ books }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById('similar-books-container');
    const scrollAmount = direction === 'left' ? -320 : 320;
    const newPosition = scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  return (
    <div className="my-12 bg-gray-50 p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="border-b-4 border-primary pb-1">Vous pourriez aussi aimer</span>
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white hover:bg-primary hover:text-white transition-colors shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white hover:bg-primary hover:text-white transition-colors shadow"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        id="similar-books-container"
        className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {books.map(book => (
          <div key={book.id} className="flex-shrink-0">
            <BookCard item={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarBooks;