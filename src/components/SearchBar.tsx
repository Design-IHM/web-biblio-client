// src/components/SearchBar.jsx
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    year: '',
    category: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, ...filters });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      year: '',
      category: '',
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center p-3 border-b border-gray-100">
          <button type="submit" className="mr-2 text-gray-500 hover:text-primary">
            <Search size={20} />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des livres, mémoires, auteurs..."
            className="flex-1 outline-none text-lg"
          />
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Filter size={20} className={showFilters ? "text-primary" : "text-gray-500"} />
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-b-lg animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Filtres</h3>
              <button 
                type="button" 
                onClick={clearFilters}
                className="text-sm text-primary flex items-center"
              >
                <X size={16} className="mr-1" />
                Effacer les filtres
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous</option>
                  <option value="book">Livres</option>
                  <option value="memoir">Mémoires</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select 
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Toutes les années</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="science">Science</option>
                  <option value="literature">Littérature</option>
                  <option value="history">Histoire</option>
                  <option value="technology">Technologie</option>
                  <option value="art">Art</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="mt-4 w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Appliquer les filtres
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;