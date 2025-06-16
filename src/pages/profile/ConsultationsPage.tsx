// src/pages/dashboard/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { historyService, HistoryEvent } from '../../services/historyService';
import { authService } from '../../services/auth/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Book, Clock, Filter, GraduationCap } from 'lucide-react';

const HistoryPage = () => {
    const [history, setHistory] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'book_view' | 'thesis_view'>('all');

    useEffect(() => {
        const fetchHistory = async () => {
            const user = await authService.getCurrentUser();
            if (user && user.id) {
                const userHistory = await historyService.getUserHistory(user.id);
                setHistory(userHistory);
            }
            setLoading(false);
        };

        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item => filter === 'all' || item.type === filter);

    const groupHistoryByDate = (events: HistoryEvent[]) => {
        const grouped: { [key: string]: HistoryEvent[] } = {};
        events.forEach(event => {
            const date = event.timestamp.toDate().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(event);
        });
        return grouped;
    };

    const groupedAndFilteredHistory = groupHistoryByDate(filteredHistory);

    if (loading) {
        return <LoadingSpinner size="lg" text="Chargement de votre historique..." />;
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* En-tête de la page */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Historique de Consultation</h1>
                    <p className="text-gray-500 mt-1">Vos 50 dernières activités sur la plateforme.</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <Filter size={20} className="text-gray-500" />
                <FilterButton label="Tout" isActive={filter === 'all'} onClick={() => setFilter('all')} />
                <FilterButton label="Livres" isActive={filter === 'book_view'} onClick={() => setFilter('book_view')} />
                <FilterButton label="Mémoires" isActive={filter === 'thesis_view'} onClick={() => setFilter('thesis_view')} />
            </div>
            
            {/* Timeline de l'historique */}
            <div className="space-y-8">
                {Object.keys(groupedAndFilteredHistory).length > 0 ? (
                    Object.entries(groupedAndFilteredHistory).map(([date, events]) => (
                        <div key={date}>
                            <h2 className="font-semibold text-lg text-secondary mb-4 pb-2 border-b-2 border-primary/20">{date}</h2>
                            <div className="space-y-4">
                                {events.map(event => (
                                    <HistoryItem key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-secondary">Aucun historique à afficher</h3>
                        <p className="text-gray-500 mt-2">Commencez à explorer notre catalogue pour voir votre activité ici.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant pour un bouton de filtre
const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void; }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
        {label}
    </button>
);

// Composant pour un élément de l'historique
const HistoryItem = ({ event }: { event: HistoryEvent }) => {
    const isBook = event.type === 'book_view';
    const linkTo = isBook ? `/books/${event.itemId}` : `/thesis/${event.itemId}`;
    const Icon = isBook ? Book : GraduationCap;

    return (
        <Link to={linkTo} className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-lg hover:border-primary border border-transparent transition-all duration-300 group">
            <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={event.itemCoverUrl || `https://ui-avatars.com/api/?name=${event.itemTitle.charAt(0)}&background=1b263b&color=fff&size=64`}
                      alt={event.itemTitle}
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className={isBook ? "text-primary" : "text-blue-500"} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${isBook ? "text-primary" : "text-blue-500"}`}>
                            {isBook ? "Livre" : "Mémoire"}
                        </span>
                    </div>
                    <h4 className="font-semibold text-secondary group-hover:text-primary transition-colors">{event.itemTitle}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Consulté à {event.timestamp.toDate().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default HistoryPage;