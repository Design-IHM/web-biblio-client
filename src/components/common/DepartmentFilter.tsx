import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase.ts';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { Filter, ChevronDown, X, Check, Image as ImageIcon } from 'lucide-react';

interface Department {
    id: string;
    nom: string;
    image?: string;
}

interface DepartmentFilterProps {
    selectedDepartments: string[];
    onDepartmentChange: (departments: string[]) => void;
    className?: string;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
                                                               selectedDepartments,
                                                               onDepartmentChange,
                                                               className = ""
                                                           }) => {
    const { orgSettings } = useConfig();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Departements'));
                const departmentsList: Department[] = [];

                querySnapshot.forEach((doc) => {
                    departmentsList.push({
                        id: doc.id,
                        ...doc.data()
                    } as Department);
                });

                // Trier par nom
                departmentsList.sort((a, b) => a.nom.localeCompare(b.nom));
                setDepartments(departmentsList);
            } catch (error) {
                console.error('Erreur lors du chargement des départements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // Filtrer les départements par terme de recherche
    const filteredDepartments = departments.filter(dept =>
        dept.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gérer la sélection d'un département
    const handleDepartmentToggle = (departmentId: string) => {
        const department = departments.find(d => d.id === departmentId);
        if (!department) return;

        const departmentName = department.nom;

        if (selectedDepartments.includes(departmentName)) {
            const updatedSelection = selectedDepartments.filter(name => name !== departmentName);
            onDepartmentChange(updatedSelection);
        } else {
            const updatedSelection = [...selectedDepartments, departmentName];
            onDepartmentChange(updatedSelection);
        }
    };

    // Effacer tous les filtres
    const clearAllFilters = () => {
        onDepartmentChange([]);
    };

    // Sélectionner tous les départements
    const selectAllDepartments = () => {
        const allDepartmentNames = departments.map(dept => dept.nom);
        onDepartmentChange(allDepartmentNames);
    };

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.department-filter-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
            {/* En-tête du filtre */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${primaryColor}15` }}
                        >
                            <Filter className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <h3 className="font-semibold text-gray-800">Départements</h3>
                    </div>

                    {selectedDepartments.length > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-red-500 cursor-pointer hover:text-red-700 flex items-center transition-colors font-medium"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Effacer
                        </button>
                    )}
                </div>

                {/* Dropdown de sélection */}
                <div className="relative department-filter-dropdown">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                    >
                        <span className={`${selectedDepartments.length === 0 ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                            {selectedDepartments.length === 0
                                ? 'Tous les départements'
                                : selectedDepartments.length === departments.length
                                    ? 'Tous les départements'
                                    : `${selectedDepartments.length} sélectionné${selectedDepartments.length > 1 ? 's' : ''}`
                            }
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Liste déroulante */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
                            {/* Barre de recherche */}
                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="Rechercher un département..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                                />
                            </div>

                            {/* Actions rapides */}
                            <div className="p-2 border-b border-gray-100 flex gap-2">
                                <button
                                    onClick={() => {
                                        selectAllDepartments();
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-xs px-3 cursor-pointer py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Tout sélectionner
                                </button>
                                <button
                                    onClick={() => {
                                        clearAllFilters();
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-xs px-3 cursor-pointer py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Tout désélectionner
                                </button>
                            </div>

                            {/* Liste des départements */}
                            <div className="max-h-60 overflow-y-auto">
                                {filteredDepartments.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        Aucun département trouvé
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {filteredDepartments.map((department) => (
                                            <button
                                                key={department.id}
                                                onClick={() => handleDepartmentToggle(department.id)}
                                                className="w-full flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                                            >
                                                {/* Image du département */}
                                                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                    {department.image ? (
                                                        <img
                                                            src={department.image}
                                                            alt={department.nom}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>

                                                {/* Nom du département */}
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800 group-hover:text-gray-900">
                                                        {department.nom}
                                                    </div>
                                                </div>

                                                {/* Checkbox */}
                                                <div className="flex-shrink-0">
                                                    {selectedDepartments.includes(department.id) ? (
                                                        <div
                                                            className="w-5 h-5 rounded flex items-center justify-center"
                                                            style={{ backgroundColor: primaryColor }}
                                                        >
                                                            <Check className="w-3 h-3 text-white cursor-pointer" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 border-2 border-gray-300 rounded group-hover:border-gray-400 transition-colors"></div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tags des départements sélectionnés */}
            {selectedDepartments.length > 0 && selectedDepartments.length < departments.length && (
                <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {selectedDepartments.map((deptId) => {
                            const dept = departments.find(d => d.id === deptId);
                            if (!dept) return null;

                            return (
                                <div
                                    key={deptId}
                                    className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm"
                                    style={{
                                        backgroundColor: `${primaryColor}10`,
                                        borderColor: `${primaryColor}30`,
                                        color: primaryColor
                                    }}
                                >
                                    {/* Image miniature */}
                                    {dept.image && (
                                        <div className="w-4 h-4 rounded-full overflow-hidden mr-2">
                                            <img
                                                src={dept.image}
                                                alt={dept.nom}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <span className="max-w-[100px] truncate">{dept.nom}</span>

                                    <button
                                        onClick={() => handleDepartmentToggle(deptId)}
                                        className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Statistiques */}
            <div className="px-4 pb-4">
                <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>{departments.length} département{departments.length > 1 ? 's' : ''} disponible{departments.length > 1 ? 's' : ''}</span>
                    {selectedDepartments.length > 0 && (
                        <span className="font-medium" style={{ color: primaryColor }}>
                            {selectedDepartments.length} sélectionné{selectedDepartments.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentFilter;
