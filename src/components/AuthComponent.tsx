import React, { useState } from 'react';

// Define color variables at the top for easy reuse
const colors = {
  primary: '#ff8c00',    // Orange
  secondary: '#1b263b'   // Dark blue
};

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full" style={{ backgroundColor: colors.primary }} className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Connectez-vous' : 'Inscription - Bibliothèque'}
        </h2>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full ${isLogin ? 'sm:max-w-md' : 'sm:max-w-2xl'} px-4`}>

        <div className="bg-white py-8 px- shadow sm:rounded-lg sm:px-10">
          {isLogin ? (
            // Login Form
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="pl-10 focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Entrez votre email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pl-10 focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Entrez votre mot de passe"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: colors.primary }} hover={`${colors.primary}/80`}>
                    Mot de passe oublié?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  Se connecter
                </button>
              </div>
            </form>
          ) : (
            // Registration Form 
            <form className="space-y-6 w-full max-w-6xl px-4 mx-auto">
              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Photo de profil</h3>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 border-2" style={{ borderColor: colors.primary }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="avatar" 
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white cursor-pointer"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Choisir une photo
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informations personnelles</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Nom d'utilisateur
                    </label>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Entrez votre nom d'utilisateur"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Entrez votre email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">
                      Matricule
                    </label>
                    <div className="mt-1">
                      <input
                        id="matricule"
                        name="matricule"
                        type="text"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Entrez votre matricule"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Entrez votre numéro de téléphone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Academic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informations académiques</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Département
                    </label>
                    <div className="mt-1">
                      <select
                        id="department"
                        name="department"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                      >
                        <option value="">Sélectionner un département</option>
                        <option value="informatique">Informatique</option>
                        <option value="mathematiques">Mathématiques</option>
                        <option value="physique">Physique</option>
                        <option value="chimie">Chimie</option>
                        <option value="biologie">Biologie</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                      Niveau
                    </label>
                    <div className="mt-1">
                      <select
                        id="level"
                        name="level"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                      >
                        <option value="">Sélectionner un niveau</option>
                        <option value="licence1">Licence 1</option>
                        <option value="licence2">Licence 2</option>
                        <option value="licence3">Licence 3</option>
                        <option value="master1">Master 1</option>
                        <option value="master2">Master 2</option>
                        <option value="doctorat">Doctorat</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Sécurité</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Entrez votre mot de passe"
                      />
                      <div 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmation du mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="focus:ring-[#ff8c00] focus:border-[#ff8c00] block w-full sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Confirmez votre mot de passe"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: colors.secondary }}
                >
                  S'inscrire
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: colors.secondary }}>
                  {isLogin ? 'Nouveau sur la plateforme?' : 'Vous avez déjà un compte?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8c00]"
                style={{ backgroundColor: isLogin ? colors.secondary : colors.primary }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;