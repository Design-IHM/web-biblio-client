import { useState } from 'react';
import { BarChart4, DollarSign, TrendingUp, TrendingDown, Users, Percent, ArrowRight } from 'lucide-react';

// Définition des variables de couleur
const COLORS = {
  primary: '#ff8c00',    // Orange
  secondary: '#1b263b',  // Dark Blue
  lightGray: '#f8f9fa',
  accent: '#4ade80',     // Green
  danger: '#ef4444',     // Red
};

// Données pour le graphique
const chartData = [
  { day: '01', value: 120 },
  { day: '02', value: 150 },
  { day: '03', value: 180 },
  { day: '04', value: 135 },
  { day: '05', value: 160 },
  { day: '06', value: 190 },
  { day: '07', value: 210 },
  { day: '08', value: 180 },
  { day: '09', value: 150 },
  { day: '10', value: 170 },
  { day: '11', value: 140 },
  { day: '12', value: 120 },
  { day: '13', value: 110 },
  { day: '14', value: 130 },
  { day: '15', value: 145 },
  { day: '16', value: 135 },
  { day: '17', value: 155 },
  { day: '18', value: 175 },
  { day: '19', value: 165 },
  { day: '20', value: 185 },
  { day: '21', value: 200 },
  { day: '22', value: 220 },
  { day: '23', value: 240 },
  { day: '24', value: 255 },
  { day: '25', value: 270 },
];

// Données pour la section des transactions
const transactions = [
  { 
    id: 1, 
    title: 'Roman historique',
    category: 'Livre',
    time: '15:30',
    date: 'Aujourd\'hui',
    amount: '-25.00',
    color: '#3b82f6', // Blue
    icon: '📚'
  },
  { 
    id: 2, 
    title: 'Abonnement Premium',
    category: 'Service',
    time: '12:45',
    date: 'Aujourd\'hui',
    amount: '-15.99',
    color: '#8b5cf6', // Purple
    icon: '⭐'
  },
  { 
    id: 3, 
    title: 'Manga - Tome 5',
    category: 'BD/Manga',
    time: '10:15',
    date: 'Aujourd\'hui',
    amount: '-12.50',
    color: '#ec4899', // Pink
    icon: '🗯️'
  },
  { 
    id: 4, 
    title: 'Remboursement',
    category: 'Retour',
    time: '09:30',
    date: 'Hier',
    amount: '+35.00',
    color: '#10b981', // Green
    icon: '💰'
  },
];

// Données pour les statistiques d'utilisation
const usageStats = [
  { 
    title: 'Romans',
    percentage: 65,
    value: '652.400',
    color: '#3b82f6', // Blue
  },
  { 
    title: 'Sciences',
    percentage: 45,
    value: '478.200',
    color: '#8b5cf6', // Purple
  },
  { 
    title: 'BD/Manga',
    percentage: 80,
    value: '892.500',
    color: '#ec4899', // Pink
  },
  { 
    title: 'Revues',
    percentage: 30,
    value: '324.700',
    color: '#10b981', // Green
  },
  { 
    title: 'Numérique',
    percentage: 55,
    value: '556.000',
    color: '#f59e0b', // Amber
  },
];

// Section de carte statistique
interface StatCardProps {
  title: string;
  value: string;
  percentChange: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, percentChange, icon, color }: StatCardProps) => {
  const isPositive = percentChange >= 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center" 
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span 
          className={`flex items-center text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {isPositive ? '+' : ''}{percentChange}%
        </span>
      </div>
      <div className="mt-2">
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  // États pour les filtres de période
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Maximun du graphique
  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500">01 - 25 Avril, 2025</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'day' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPeriod('day')}
          >
            Jour
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'week' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPeriod('week')}
          >
            Semaine
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'month' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPeriod('month')}
          >
            Mois
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'year' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPeriod('year')}
          >
            Année
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Livres empruntés"
          value="256"
          percentChange={12.8}
          icon={<BarChart4 size={24} />}
          color={COLORS.primary}
        />
        <StatCard 
          title="Total dépensé"
          value="185,20 €"
          percentChange={-4.3}
          icon={<DollarSign size={24} />}
          color="#8b5cf6"
        />
        <StatCard 
          title="Livres en retard"
          value="3"
          percentChange={0}
          icon={<Percent size={24} />}
          color="#ef4444"
        />
        <StatCard 
          title="Recommandations"
          value="28"
          percentChange={32.5}
          icon={<Users size={24} />}
          color="#10b981"
        />
      </div>

      {/* Section principale avec graphique et transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Activité</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
              Emprunts
            </div>
          </div>
          
          {/* Graphique en barres */}
          <div className="h-64 flex items-end space-x-2">
            {chartData.map((data, index) => (
              <div 
                key={data.day} 
                className="flex-1 flex flex-col items-center justify-end"
              >
                <div 
                  className="w-full max-w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${(data.value / maxValue) * 100}%`, 
                    backgroundColor: index === chartData.length - 1 ? COLORS.primary : '#e2e8f0',
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions récentes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Transactions récentes</h2>
            <button className="text-sm text-blue-500 flex items-center">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${transaction.color}15` }}
                  >
                    <span className="text-lg">{transaction.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.title}</h4>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={transaction.amount.startsWith('-') ? 'text-gray-800' : 'text-green-500'}>
                    {transaction.amount} €
                  </p>
                  <p className="text-xs text-gray-500">{transaction.time} • {transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section statistiques d'utilisation */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Catégories populaires</h2>
          <div className="text-sm text-gray-500">Ce mois-ci</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {usageStats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{stat.title}</span>
                <span className="text-gray-500">{stat.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;