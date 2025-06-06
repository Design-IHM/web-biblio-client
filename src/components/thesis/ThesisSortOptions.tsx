import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
    SortAsc,
    SortDesc,
    Grid3X3,
    List,
    Calendar,
    Star,
    User,
    ChevronDown
} from 'lucide-react';

export type ThesisSortOption =
    | 'name-asc'
    | 'name-desc'
    | 'year-asc'
    | 'year-desc'
    | 'rating-asc'
    | 'rating-desc'
    | 'author-asc'
    | 'author-desc'
    | 'department-asc';

export type ViewMode = 'grid' | 'list';

interface ThesisSortOptionsProps {
    currentSort: ThesisSortOption;
    onSortChange: (sort: ThesisSortOption) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    className?: string;
}

const ThesisSortOptions: React.FC<ThesisSortOptionsProps> = ({
                                                                 currentSort,
                                                                 onSortChange,
                                                                 viewMode,
                                                                 onViewModeChange,
                                                                 className = ""
                                                             }) => {
    const { orgSettings } = useConfig();
    const [isSortOpen, setIsSortOpen] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    const sortOptions = [
        {
            value: 'name-asc' as ThesisSortOption,
            label: 'Auteur (A-Z)',
            icon: SortAsc
        },
        {
            value: 'name-desc' as ThesisSortOption,
            label: 'Auteur (Z-A)',
            icon: SortDesc
        },
        {
            value: 'year-desc' as ThesisSortOption,
            label: 'Plus récents',
            icon: Calendar
        },
        {
            value: 'year-asc' as ThesisSortOption,
            label: 'Plus anciens',
            icon: Calendar
        },
        {
            value: 'rating-desc' as ThesisSortOption,
            label: 'Mieux notés',
            icon: Star
        },
        {
            value: 'department-asc' as ThesisSortOption,
            label: 'Département (A-Z)',
            icon: User
        }
    ];

    const getCurrentSortLabel = () => {
        const option = sortOptions.find(opt => opt.value === currentSort);
        return option?.label || 'Trier par';
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Contrôles */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Sélecteur de tri */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex cursor-pointer items-center justify-between px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors min-w-[140px]"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {getCurrentSortLabel()}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${
                                    isSortOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Menu déroulant de tri */}
                        {isSortOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                                <div className="p-2">
                                    {sortOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    onSortChange(option.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                                                    currentSort === option.value
                                                        ? 'font-medium'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                                style={{
                                                    backgroundColor: currentSort === option.value ? `${primaryColor}10` : 'transparent',
                                                    color: currentSort === option.value ? primaryColor : '#374151'
                                                }}
                                            >
                                                <IconComponent className="w-4 h-4 mr-3" />
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sélecteur de vue */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 cursor-pointer transition-colors ${
                                viewMode === 'grid'
                                    ? 'text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            style={{
                                backgroundColor: viewMode === 'grid' ? primaryColor : 'transparent'
                            }}
                            title="Vue grille"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 cursor-pointer transition-colors border-l border-gray-200 ${
                                viewMode === 'list'
                                    ? 'text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            style={{
                                backgroundColor: viewMode === 'list' ? primaryColor : 'transparent'
                            }}
                            title="Vue liste"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThesisSortOptions;
