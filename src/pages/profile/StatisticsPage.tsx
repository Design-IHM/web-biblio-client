import { useState } from 'react';
import { BookOpen, Users, Clock, TrendingUp, TrendingDown, BookMarked, Award, ArrowRight } from 'lucide-react';

// Brand colors
const COLORS = {
  primary: '#ff8c00',    // Orange
  secondary: '#1b263b',  // Dark Blue
  primaryLight: '#ffe0b2', // Light orange for backgrounds
  secondaryLight: '#d0d7e5', // Light blue for backgrounds
  success: '#4ade80',    // Green
  danger: '#ef4444',     // Red
};

// Data for the chart
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

// Data for the activity section
const activities = [
  { 
    id: 1, 
    title: 'Roman historique',
    category: 'Livre',
    time: '15:30',
    date: 'Aujourd\'hui',
    action: 'Emprunté',
    color: '#3b82f6', // Blue
    icon: '📚'
  },
  { 
    id: 2, 
    title: 'Abonnement Premium',
    category: 'Service',
    time: '12:45',
    date: 'Aujourd\'hui',
    action: 'Inscription',
    color: COLORS.primary, // Orange
    icon: '⭐'
  },
  { 
    id: 3, 
    title: 'Manga - Tome 5',
    category: 'BD/Manga',
    time: '10:15',
    date: 'Aujourd\'hui',
    action: 'Emprunté',
    color: COLORS.secondary, // Dark blue
    icon: '🗯️'
  },
  { 
    id: 4, 
    title: 'Encyclopédie Scientifique',
    category: 'Référence',
    time: '09:30',
    date: 'Hier',
    action: 'Retourné',
    color: COLORS.success, // Green
    icon: '📖'
  },
];

// Data for usage statistics
const usageStats = [
  { 
    title: 'Romans',
    percentage: 65,
    value: '652',
    color: COLORS.primary, // Orange
  },
  { 
    title: 'Sciences',
    percentage: 45,
    value: '478',
    color: COLORS.secondary, // Dark blue
  },
  { 
    title: 'BD/Manga',
    percentage: 80,
    value: '892',
    color: '#8b5cf6', // Purple
  },
  { 
    title: 'Revues',
    percentage: 30,
    value: '324',
    color: COLORS.success, // Green
  },
  { 
    title: 'Numérique',
    percentage: 55,
    value: '556',
    color: COLORS.primary, // Orange
  },
];

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  percentChange?: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, percentChange, icon, color, bgColor }: StatCardProps) => {
  const isPositive = percentChange ? percentChange >= 0 : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center" 
          style={{ backgroundColor: bgColor }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {percentChange !== undefined && (
          <span 
            className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {isPositive ? '+' : ''}{percentChange}%
          </span>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1" style={{ color: COLORS.secondary }}>{value}</p>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  // States for period filters
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Chart maximum value
  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="space-y-8 bg-gray-50 p-6 min-h-screen">
      {/* Header with logo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: COLORS.primary }}>
            <BookOpen size={24} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.secondary }}>Biblio ENSPY</h1>
            <p className="text-gray-500">01 - 25 Avril, 2025</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'day' 
                ? `text-white` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={{ backgroundColor: period === 'day' ? COLORS.primary : '' }}
            onClick={() => setPeriod('day')}
          >
            Jour
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'week' 
                ? `text-white` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={{ backgroundColor: period === 'week' ? COLORS.primary : '' }}
            onClick={() => setPeriod('week')}
          >
            Semaine
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'month' 
                ? `text-white` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={{ backgroundColor: period === 'month' ? COLORS.primary : '' }}
            onClick={() => setPeriod('month')}
          >
            Mois
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              period === 'year' 
                ? `text-white` 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={{ backgroundColor: period === 'year' ? COLORS.primary : '' }}
            onClick={() => setPeriod('year')}
          >
            Année
          </button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Livres empruntés"
          value="256"
          percentChange={12.8}
          icon={<BookOpen size={24} />}
          color={COLORS.primary}
          bgColor={COLORS.primaryLight}
        />
        <StatCard 
          title="Membres actifs"
          value="185"
          percentChange={8.3}
          icon={<Users size={24} />}
          color={COLORS.secondary}
          bgColor={COLORS.secondaryLight}
        />
        <StatCard 
          title="Livres en retard"
          value="3"
          percentChange={-25}
          icon={<Clock size={24} />}
          color={COLORS.danger}
          bgColor="#fde2e2"
        />
        <StatCard 
          title="Recommandations"
          value="28"
          percentChange={32.5}
          icon={<Award size={24} />}
          color={COLORS.success}
          bgColor="#d1fae5"
        />
      </div>

      {/* Main section with chart and activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: COLORS.primary }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: COLORS.secondary }}>Activité de prêt</h2>
            <div className="flex items-center text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.primary }}></span>
              Emprunts
            </div>
          </div>
          
          {/* Bar chart */}
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
                    backgroundColor: COLORS.primary,
                    opacity: index === chartData.length - 1 ? 1 : 0.5 + (index / (chartData.length * 2)),
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: COLORS.secondary }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: COLORS.secondary }}>Activités récentes</h2>
            <button className="text-sm flex items-center" style={{ color: COLORS.primary }}>
              Voir tout <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ color: activity.action === 'Retourné' ? COLORS.success : COLORS.secondary }}>
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time} • {activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage statistics section */}
      <div className="bg-white rounded-xl shadow-md p-6 border-t-4" style={{ borderColor: COLORS.secondary }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: COLORS.secondary }}>Catégories populaires</h2>
          <div className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}>Ce mois-ci</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
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
              <span className="text-sm">{stat.value} livres</span>
            </div>
          ))}
        </div>
      </div>

      {/* Library info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: COLORS.primary }}>
          <div className="flex items-center mb-4">
            <BookMarked size={24} style={{ color: COLORS.primary }} className="mr-3" />
            <h2 className="text-xl font-bold" style={{ color: COLORS.secondary }}>Nouveaux arrivages</h2>
          </div>
          <p className="mb-4 text-gray-600">Découvrez les nouvelles acquisitions de la bibliothèque:</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.primaryLight }}>
              <p className="font-medium">Physique Quantique - Introduction</p>
              <p className="text-sm text-gray-600">Sciences - Disponible</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.secondaryLight }}>
              <p className="font-medium">Intelligence Artificielle et Société</p>
              <p className="text-sm text-gray-600">Technologie - Disponible</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.primaryLight }}>
              <p className="font-medium">Les Architectes du Monde Nouveau</p>
              <p className="text-sm text-gray-600">Histoire - Disponible</p>
            </div>
          </div>
          <button 
            className="mt-4 w-full py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            Explorer la collection <ArrowRight size={16} className="ml-2" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: COLORS.secondary }}>
          <div className="flex items-center mb-4">
            <Users size={24} style={{ color: COLORS.secondary }} className="mr-3" />
            <h2 className="text-xl font-bold" style={{ color: COLORS.secondary }}>Horaires d'ouverture</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Lundi - Vendredi</span>
              <span>8h00 - 20h00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Samedi</span>
              <span>9h00 - 18h00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Dimanche</span>
              <span>10h00 - 16h00</span>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: COLORS.secondaryLight }}>
            <h3 className="font-medium mb-2" style={{ color: COLORS.secondary }}>Annonce</h3>
            <p className="text-sm text-gray-600">Atelier de recherche documentaire le 30 avril. Inscrivez-vous à l'accueil de la bibliothèque.</p>
          </div>
          <button 
            className="mt-4 w-full py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center justify-center"
            style={{ backgroundColor: COLORS.secondary }}
          >
            Plus d'informations <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;