import React, { useState } from 'react';

const Profile = () => {
  // État pour gérer les différents onglets
  const [activeTab, setActiveTab] = useState('personal');
  
  // Couleurs du thème
  const primaryColor = "#ff8c00";
  const secondaryColor = "#1b263b";
  
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* En-tête du profil avec photo */}
        <div style={{ backgroundColor: secondaryColor }} className="px-8 py-12 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-6 md:mb-0">
              <div className="w-36 h-36 rounded-full bg-white p-1 shadow-lg">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-5xl font-bold text-white">BBD</span>
                </div>
              </div>
              <button 
                className="absolute bottom-0 right-0 rounded-full p-2"
                style={{ backgroundColor: primaryColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="md:ml-8 text-center md:text-left">
              <h1 className="text-3xl font-bold">BornBeforeDesign</h1>
              <p className="text-gray-300 mt-1">Membre depuis 2023</p>
              <div className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-opacity-20 bg-white">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span className='text-black'>En ligne</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation entre les sections */}
        <div className="px-6 border-b">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-6 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'personal' 
                  ? 'border-b-2 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'personal' ? { borderColor: primaryColor } : {}}
            >
              Informations personnelles
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-6 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'preferences' 
                  ? 'border-b-2 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'preferences' ? { borderColor: primaryColor } : {}}
            >
              Préférences
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'security' 
                  ? 'border-b-2 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'security' ? { borderColor: primaryColor } : {}}
            >
              Confidentialité et sécurité
            </button>
          </div>
        </div>
        
        {/* Contenu des onglets */}
        <div className="p-8">
          {/* Informations personnelles */}
          {activeTab === 'personal' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6" style={{ color: secondaryColor }}>
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input 
                    type="text" 
                    value="Jean" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                    style={{ focusRing: primaryColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input 
                    type="text" 
                    value="Dupont" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value="jean.dupont@example.com" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input 
                    type="tel" 
                    value="06 12 34 56 78" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input 
                    type="text" 
                    value="123 Rue de la Bibliothèque" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition h-32"
                    placeholder="Parlez-nous de vous..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}
          
          {/* Préférences */}
          {activeTab === 'preferences' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6" style={{ color: secondaryColor }}>
                Préférences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Langue et région</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                      <option>Français</option>
                      <option>English</option>
                      <option>Español</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format de date
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                      <option>JJ/MM/AAAA</option>
                      <option>MM/JJ/AAAA</option>
                      <option>AAAA-MM-JJ</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Thème</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input type="radio" id="theme-light" name="theme" className="h-4 w-4" checked />
                      <label htmlFor="theme-light" className="ml-2">Clair</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="theme-dark" name="theme" className="h-4 w-4" />
                      <label htmlFor="theme-dark" className="ml-2">Sombre</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="theme-system" name="theme" className="h-4 w-4" />
                      <label htmlFor="theme-system" className="ml-2">Système</label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications par email</h4>
                        <p className="text-sm text-gray-500">Recevoir des mises à jour par email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications par SMS</h4>
                        <p className="text-sm text-gray-500">Recevoir des alertes par SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Newsletter</h4>
                        <p className="text-sm text-gray-500">S'abonner à notre newsletter mensuelle</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          )}
          
          {/* Confidentialité et sécurité */}
          {activeTab === 'security' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6" style={{ color: secondaryColor }}>
                Confidentialité et sécurité
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Mot de passe</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                        placeholder="••••••••"
                      />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le mot de passe
                      </label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button 
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Mettre à jour le mot de passe
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Authentification à deux facteurs</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1">Statut: <span className="text-red-500 font-medium">Désactivé</span></p>
                      <p className="text-sm text-gray-500">Protégez votre compte avec une couche de sécurité supplémentaire</p>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      Activer
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4" style={{ color: secondaryColor }}>Confidentialité du profil</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profil public</h4>
                        <p className="text-sm text-gray-500">Permettre aux autres utilisateurs de voir votre profil</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Afficher l'activité</h4>
                        <p className="text-sm text-gray-500">Montrer votre activité aux autres utilisateurs</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-medium mb-4 text-red-500">Zone de danger</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Supprimer mon compte</h4>
                      <p className="text-sm text-gray-500">Cette action est irréversible et supprimera toutes vos données</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-white font-medium bg-red-500">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;