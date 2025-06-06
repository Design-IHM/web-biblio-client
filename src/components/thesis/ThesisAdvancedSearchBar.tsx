import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    Search,
    X,
    Filter,
    GraduationCap,
    User,
    Building,
    Tag,
    Calendar
} from 'lucide-react';
import { ThesisSearchFilters } from '../../types/thesis';

interface ThesisAdvancedSearchBarProps {
    onSearchChange: (filters: ThesisSearchFilters) => void;
    placeholder?: string;
    className?: string;
}

const ThesisAdvancedSearchBar: React.FC<ThesisAdvancedSearchBarProps> = ({
                                                                             onSearchChange,
                                                                             placeholder = "Rechercher des mémoires, auteurs, départements...",
                                                                             className = ""
                                                                         }) => {
    const { orgSettings } = useConfig();
    const [filters, setFilters] = useState<ThesisSearchFilters>({
        query: '',
        author: '',
        department: '',
        year: '',
        keywords: '',
        supervisor: ''
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    // Déclencher la recherche quand les filtres changent
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchChange(filters);
        }, 300); // Debounce de 300ms

        return () => clearTimeout(timeoutId);
    }, [filters, onSearchChange]);

    // Gérer les changements de filtres
    const handleFilterChange = (key: keyof ThesisSearchFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Effacer tous les filtres
    const clearAllFilters = () => {
        setFilters({
            query: '',
            author: '',
            department: '',
            year: '',
            keywords: '',
            supervisor: ''
        });
        setShowAdvanced(false);
    };

    // Vérifier si des filtres avancés sont actifs
    const hasAdvancedFilters = filters.author || filters.department || filters.year || filters.keywords || filters.supervisor;

    // Fermer les filtres avancés quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
            {/* Barre de recherche principale */}
            <div className={`flex items-center p-4 transition-all duration-200 ${
                isFocused ? 'ring-2 ring-opacity-50' : ''
            }`}>
                <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />

                <input
                    type="text"
                    placeholder={placeholder}
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="flex-1 text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                />

                {/* Boutons d'action */}
                <div className="flex items-center gap-2 ml-3">
                    {(filters.query || hasAdvancedFilters) && (
                        <button
                            onClick={clearAllFilters}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Effacer la recherche"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}

                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                            showAdvanced || hasAdvancedFilters
                                ? 'text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        style={{
                            backgroundColor: (showAdvanced || hasAdvancedFilters) ? primaryColor : 'transparent'
                        }}
                        title="Filtres avancés"
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filtres avancés */}
            {showAdvanced && (
                <div className="border-t border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Auteur */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                <User className="w-3 h-3 inline mr-1" />
                                Auteur
                            </label>
                            <input
                                type="text"
                                placeholder="Nom de l'auteur"
                                value={filters.author}
                                onChange={(e) => handleFilterChange('author', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Département */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                <Building className="w-3 h-3 inline mr-1" />
                                Département
                            </label>
                            <input
                                type="text"
                                placeholder="Département d'étude"
                                value={filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Superviseur */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                <GraduationCap className="w-3 h-3 inline mr-1" />
                                Superviseur
                            </label>
                            <input
                                type="text"
                                placeholder="Nom du superviseur"
                                value={filters.supervisor}
                                onChange={(e) => handleFilterChange('supervisor', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Mots-clés */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                <Tag className="w-3 h-3 inline mr-1" />
                                Mots-clés
                            </label>
                            <input
                                type="text"
                                placeholder="Mots-clés du mémoire"
                                value={filters.keywords}
                                onChange={(e) => handleFilterChange('keywords', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Année */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Année de soutenance
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 2024"
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>

                    {/* Actions des filtres avancés */}
                    {hasAdvancedFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Filtres actifs : {[filters.author, filters.department, filters.year, filters.keywords, filters.supervisor].filter(Boolean).length}
                                </span>

                                <button
                                    onClick={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            author: '',
                                            department: '',
                                            year: '',
                                            keywords: '',
                                            supervisor: ''
                                        }));
                                    }}
                                    className="text-xs cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Effacer les filtres avancés
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Suggestions de recherche rapide */}
            {isFocused && !filters.query && (
                <div className="border-t border-gray-100 p-4">
                    <div className="text-xs font-medium text-gray-600 mb-3">Recherches populaires :</div>
                    <div className="flex flex-wrap gap-2">
                        {['Génie Informatique', 'Génie Civil', 'Génie Électrique', 'Génie Mécanique', 'Management'].map((term) => (
                            <button
                                key={term}
                                onClick={() => handleFilterChange('query', term)}
                                className="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThesisAdvancedSearchBar;
