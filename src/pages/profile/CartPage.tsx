import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Download, Book, ArrowRight, ChevronLeft } from 'lucide-react';

// Définition des variables de couleur
const COLORS = {
  primary: '#ff8c00',    // Orange
  secondary: '#1b263b',  // Dark Blue
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
};

// Type pour les items du panier
interface CartItem {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  quantity: number;
  inStock: boolean;
  type: 'physical' | 'digital';
}

// Données des items du panier
const cartItemsData: CartItem[] = [
  {
    id: 1,
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    coverImage: '/api/placeholder/200/300',
    quantity: 1,
    inStock: true,
    type: 'physical'
  },
  {
    id: 2,
    title: 'Candide',
    author: 'Voltaire',
    coverImage: '/api/placeholder/200/300',
    quantity: 1,
    inStock: true,
    type: 'physical'
  },
  {
    id: 3,
    title: 'Voyage au centre de la Terre (Édition numérique)',
    author: 'Jules Verne',
    coverImage: '/api/placeholder/200/300',
    quantity: 1,
    inStock: true,
    type: 'digital'
  }
];

// Animation pour les transitions
const fadeTransition = "transition-all duration-300 ease-in-out";

// Composant CartItem pour afficher un livre dans le panier
const CartItemCard = ({ 
  item, 
  onQuantityChange, 
  onRemove 
}: { 
  item: CartItem; 
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}) => {
  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const increaseQuantity = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${fadeTransition} hover:shadow-lg`} style={{ borderLeftColor: COLORS.primary }}>
      <div className="flex flex-col md:flex-row">
        {/* Image du livre */}
        <div className="md:w-1/6 p-4 flex items-center justify-center bg-gray-50">
          <div className="w-24 h-36 rounded-md overflow-hidden shadow-sm transform transition-transform duration-300 hover:scale-105">
            <img 
              src={item.coverImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Détails du livre */}
        <div className="md:w-5/6 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.secondary }}>{item.title}</h3>
                <p className="text-gray-600">{item.author}</p>
              </div>
              <div 
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.type === 'digital' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-orange-100'
                } ${fadeTransition}`}
                style={{ color: item.type === 'digital' ? undefined : COLORS.primary }}
              >
                {item.type === 'digital' ? 'Numérique' : 'Physique'}
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: item.inStock ? COLORS.success : COLORS.danger }}></div>
                <span className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {item.inStock ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quantité et contrôles */}
          <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-6">
            {/* Contrôles de quantité - seulement pour les livres physiques */}
            {item.type === 'physical' && (
              <div className="flex items-center">
                <button 
                  onClick={decreaseQuantity}
                  disabled={item.quantity <= 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-l-md ${fadeTransition} ${
                    item.quantity <= 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Minus size={16} />
                </button>
                <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-200">
                  {item.quantity}
                </div>
                <button 
                  onClick={increaseQuantity}
                  className={`w-8 h-8 flex items-center justify-center rounded-r-md bg-gray-100 text-gray-700 ${fadeTransition} hover:bg-gray-200`}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
            
            {/* Type de prêt */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                {item.type === 'digital' ? (
                  <button 
                    className="px-3 py-1 rounded-md text-white flex items-center gap-1"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Download size={14} />
                    Télécharger
                  </button>
                ) : (
                  <span className="text-gray-700 font-medium">
                    Prêt pour {item.quantity} semaine{item.quantity > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            
            {/* Bouton supprimer */}
            <button 
              onClick={() => onRemove(item.id)}
              className={`p-2 rounded-full ${fadeTransition} text-gray-500 hover:bg-red-50 hover:text-red-500`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant récapitulatif du panier
const CartSummary = ({ 
  items, 
  onCheckout 
}: { 
  items: CartItem[];
  onCheckout: () => void;
}) => {
  // Calculs pour le récapitulatif
  const physicalCount = items.filter(item => item.type === 'physical')
    .reduce((sum, item) => sum + item.quantity, 0);
  const digitalCount = items.filter(item => item.type === 'digital').length;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${fadeTransition}`}>
      <div className="p-4 text-white" style={{ backgroundColor: COLORS.secondary }}>
        <h3 className="text-lg font-bold mb-1">Récapitulatif de votre emprunt</h3>
        <p className="text-sm opacity-80">Bibliothèque ENSPY</p>
      </div>
      
      <div className="bg-white p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre total d'ouvrages</span>
            <span className="font-semibold" style={{ color: COLORS.primary }}>
              {totalItems} ouvrage{totalItems > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Durée du prêt</span>
            <span className="font-semibold" style={{ color: COLORS.secondary }}>2 semaines</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date de retour prévue</span>
            <span className="font-semibold" style={{ color: COLORS.secondary }}>
              {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        
        <button 
          onClick={onCheckout}
          className={`w-full mt-6 px-4 py-3 rounded-lg text-white font-medium flex items-center justify-center ${fadeTransition} transform hover:scale-[1.02] active:scale-[0.98]`}
          style={{ 
            backgroundColor: COLORS.primary,
            boxShadow: `0 4px 14px 0 ${COLORS.primary}30` 
          }}
        >
          <Book size={18} className="mr-2" />
          Confirmer l'emprunt
        </button>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-start p-3 rounded-lg bg-gray-50">
            <div className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5" style={{ color: COLORS.primary }}>
              <Book size={14} />
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: COLORS.secondary }}>
                {physicalCount > 0 
                  ? `${physicalCount} livre${physicalCount > 1 ? 's' : ''} physique${physicalCount > 1 ? 's' : ''}`
                  : 'Aucun livre physique'
                }
              </p>
              <p className="text-xs text-gray-500">Disponible(s) à l'emprunt au comptoir de la bibliothèque</p>
            </div>
          </div>
          
          <div className="flex items-start p-3 rounded-lg bg-gray-50">
            <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5 text-blue-500">
              <Download size={14} />
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: COLORS.secondary }}>
                {digitalCount > 0 
                  ? `${digitalCount} livre${digitalCount > 1 ? 's' : ''} numérique${digitalCount > 1 ? 's' : ''}`
                  : 'Aucun livre numérique'
                }
              </p>
              <p className="text-xs text-gray-500">Téléchargeable(s) immédiatement après confirmation</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badge de sécurité */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center">
          <div className="text-xs px-3 py-1 rounded-full flex items-center" style={{ backgroundColor: `${COLORS.secondary}20`, color: COLORS.secondary }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Service Bibliothèque ENSPY
          </div>
        </div>
      </div>
    </div>
  );
};

// Bouton de suggestion de livre
const SuggestedBookButton = ({ title, author }: { title: string, author: string }) => {
  return (
    <div className={`p-4 border border-gray-100 rounded-lg shadow-sm bg-white flex items-center justify-between ${fadeTransition} hover:shadow-md cursor-pointer`}>
      <div>
        <h4 className="font-medium" style={{ color: COLORS.secondary }}>{title}</h4>
        <p className="text-sm text-gray-600">{author}</p>
      </div>
      <button 
        className="p-2 rounded-full hover:bg-orange-100 transition-colors"
        style={{ color: COLORS.primary }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

// Section de livres suggérés
const SuggestedBooks = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 text-white" style={{ backgroundColor: COLORS.primary }}>
        <h3 className="text-lg font-bold">Recommandations pour vous</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <SuggestedBookButton title="Les Misérables" author="Victor Hugo" />
          <SuggestedBookButton title="Notre-Dame de Paris" author="Victor Hugo" />
          <SuggestedBookButton title="L'Étranger (Numérique)" author="Albert Camus" />
        </div>
      </div>
    </div>
  );
};

// Composant principal de la page du panier
const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsData);

  // Gestionnaire de changement de quantité
  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Gestionnaire de suppression d'un article
  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Gestionnaire de prêt
  const handleCheckout = () => {
    alert('Confirmation de votre emprunt...');
    // Logique de redirection ou de confirmation
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Navigation secondaire */}
          <nav className="flex items-center text-sm mb-8">
            <a 
              href="/" 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              Accueil
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a 
              href="/catalogue" 
              className="text-gray-500 hover:text-gray-700"
            >
              Catalogue
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span style={{ color: COLORS.primary }}>Mes emprunts</span>
          </nav>
          
          {/* En-tête avec une bande décorative */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
            <div className="pl-6">
              <h1 className="text-3xl font-bold" style={{ color: COLORS.secondary }}>Mes Emprunts</h1>
              <p className="text-gray-500">
                {cartItems.length > 0 
                  ? `${cartItems.length} ouvrage${cartItems.length > 1 ? 's' : ''} dans votre liste d'emprunts`
                  : 'Votre liste d\'emprunts est vide'
                }
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <a 
              href="/catalogue" 
              className={`flex items-center px-4 py-2 rounded-lg ${fadeTransition} text-white`}
              style={{ backgroundColor: COLORS.secondary }}
            >
              <ChevronLeft size={16} className="mr-1" />
              Retour au catalogue
            </a>
          </div>
          
          {/* Contenu principal */}
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des articles */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <CartItemCard 
                    key={item.id} 
                    item={item} 
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
                
                {/* Section suggestions */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: COLORS.secondary }}>
                    <span className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs" style={{ backgroundColor: COLORS.primary }}>+</span>
                    Suggestions de lecture
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SuggestedBookButton title="Les Misérables" author="Victor Hugo" />
                    <SuggestedBookButton title="Notre-Dame de Paris" author="Victor Hugo" />
                  </div>
                </div>
              </div>
              
              {/* Bloc latéral */}
              <div className="lg:col-span-1 space-y-6">
                {/* Résumé des emprunts */}
                <CartSummary items={cartItems} onCheckout={handleCheckout} />
                
                {/* Code de lecteur */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4" style={{ backgroundColor: COLORS.secondary, color: 'white' }}>
                    <h3 className="text-lg font-bold">Code de lecteur</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="Entrez votre code de lecteur"
                        className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none"
                        style={{ borderColor: COLORS.primary }}
                      />
                      <button 
                        className="px-4 py-2 rounded-r-md text-white"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`bg-white rounded-xl shadow-md p-10 text-center ${fadeTransition}`}>
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${COLORS.primary}20`, color: COLORS.primary }}>
                <ShoppingCart size={36} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: COLORS.secondary }}>Votre liste d'emprunts est vide</h2>
              <p className="text-gray-600 mb-6">
                Explorez notre catalogue pour découvrir nos livres et ajouter des ouvrages à votre liste d'emprunts.
              </p>
              <a 
                href="/catalogue"
                className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium ${fadeTransition} hover:shadow-lg`}
                style={{ backgroundColor: COLORS.primary }}
              >
                <Book size={18} className="mr-2" />
                Découvrir notre catalogue
              </a>
            </div>
          )}
          
          {/* Section services */}
          <div className="mt-12 rounded-xl overflow-hidden">
            <div className="p-4 text-white" style={{ backgroundColor: COLORS.secondary }}>
              <h3 className="text-lg font-bold">Services de la Bibliothèque ENSPY</h3>
            </div>
            <div className="bg-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: COLORS.secondary }}>Diversité des collections</h4>
                    <p className="text-sm text-gray-600">Une large sélection de livres et de mémoires disponibles</p>
                  </div>
                </div>
                <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: COLORS.secondary }}>Recommandations</h4>
                    <p className="text-sm text-gray-600">Personnalisées selon vos intérêts académiques</p>
                  </div>
                </div>
                <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: COLORS.secondary }}>Assistance</h4>
                    <p className="text-sm text-gray-600">Bibliothécaires disponibles pour vous aider</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;