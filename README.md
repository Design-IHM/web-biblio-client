# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## New Dependences

- TypeScript pour la sécurité du typage
- Firebase pour l'authentification et la base de données
- Hooks React pour Firebase
- React Router pour la navigation
- React Query pour la gestion des données
- Zustand pour la gestion d'état
- HeadlessUI et HeroIcons pour l'interface
- i18next pour l'internationalisation
- Tailwind CSS pour le style
- Zod et React Hook Form pour la validation des formulaires


#### initialisation du projet 
# Structure de Projet - Application de Bibliothèque (React + Vite + Firebase) en JavaScript

## 1. Installation et Configuration

```bash
# Création du projet avec Vite (JavaScript)
npm create vite@latest bibliotheque-app -- --template react

# Navigation dans le dossier
cd bibliotheque-app

# Installation des dépendances
npm install

# Dépendances Firebase
npm install firebase firebase-admin

# Dépendances pour l'authentification et la gestion des formulaires
npm install react-firebase-hooks react-hook-form

# Dépendances pour le routage et la gestion d'état
npm install react-router-dom axios @tanstack/react-query zustand

# Dépendances pour l'UI et le theme dark/light
npm install @headlessui/react @heroicons/react

# Dépendances pour l'internationalisation
npm install i18next react-i18next i18next-browser-languagedetector

# Pour le style
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2. Structure des Dossiers

```
bibliotheque-app/
├── public/                  # Fichiers publics (favicon, images statiques, etc.)
│   ├── locales/             # Fichiers de traduction
│   │   ├── fr/
│   │   ├── en/
│   │   └── ...
├── src/                     # Code source
│   ├── assets/              # Images, icônes, etc.
│   ├── components/          # Composants React réutilisables
│   │   ├── ui/          # Composants génériques (Bouton, Card, etc.)
│   │   ├── layout/          # Composants de mise en page (Header, Footer, etc.)
│   │   └── [feature]/       # Composants spécifiques aux fonctionnalités
│   ├── config/              # Configuration de l'application
│   │   ├── firebase.js      # Configuration Firebase
│   │   └── i18n.js          # Configuration i18next
│   ├── contexts/            # Contextes React
│   │   ├── AuthContext.jsx  # Contexte pour l'authentification
│   │   └── ThemeContext.jsx # Contexte pour le thème dark/light
│   ├── hooks/               # Custom hooks React
│   │   ├── useAuth.js       # Hook pour l'authentification
│   │   ├── useTheme.js      # Hook pour le thème dark/light
│   │   ├── useTranslation.js # Hook pour les traductions
│   │   └── useFirestore.js  # Hook pour Firestore
│   ├── pages/               # Pages/Routes de l'application
│   │   ├── Home/
│   │   ├── BookDetail/
│   │   ├── Catalog/
│   │   ├── Reservation/
│   │   ├── UserAccount/
│   │   ├── Auth/            # Pages d'authentification
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   └── Admin/
│   ├── services/            # Services pour les appels API
│   │   ├── firebase/        # Services Firebase
│   │   │   ├── auth.js      # Service d'authentification
│   │   │   ├── firestore.js # Service Firestore
│   │   │   └── storage.js   # Service Storage
│   │   └── api.js           # Configuration d'Axios pour API externes
│   ├── store/               # Gestion d'état global (Zustand)
│   │   ├── bookStore.js
│   │   ├── userStore.js
│   │   ├── themeStore.js    # Store pour le thème
│   │   └── reservationStore.js
│   ├── utils/               # Fonctions utilitaires
│   │   ├── formatters.js    # Formatage des dates, nombres, etc.
│   │   ├── validators.js    # Validations de formulaires
│   │   └── helpers.js       # Fonctions d'aide diverses
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée
│   └── router.jsx           # Configuration des routes
├── .eslintrc.cjs            # Configuration ESLint
├── .env                     # Variables d'environnement (à ne pas commiter)
├── .env.example             # Exemple de variables d'environnement
├── .gitignore               # Fichiers à ignorer par Git
├── index.html               # Template HTML
├── firebase.json            # Configuration Firebase
├── package.json             # Dépendances et scripts
├── postcss.config.js        # Configuration PostCSS
├── tailwind.config.js       # Configuration Tailwind CSS (avec support du dark mode)
└── vite.config.js           # Configuration Vite
```

## 3. Configuration Spécifique

### Configuration du Thème (Dark/Light Mode)

```javascript
// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème stocké ou utiliser 'system' par défaut
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    // Mettre à jour le localStorage
    localStorage.setItem('theme', theme);
    
    // Appliquer la classe dark au document
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class', // Active le mode dark via la classe "dark"
  theme: {
    extend: {
      colors: {
        // Personnaliser les couleurs du thème
        primary: {
          light: '#3B82F6', // bleu pour le mode clair
          dark: '#60A5FA',  // bleu plus clair pour le mode sombre
        },
        secondary: {
          light: '#6B7280', // gris pour le mode clair
          dark: '#9CA3AF',  // gris plus clair pour le mode sombre
        },
        background: {
          light: '#FFFFFF', // blanc pour le mode clair
          dark: '#1F2937',  // gris foncé pour le mode sombre
        },
        // Ajouter d'autres couleurs selon besoin
      },
    },
  },
  plugins: [],
}
```

### Configuration de l'Internationalisation

```javascript
// src/config/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Chargement des traductions depuis /public/locales
  .use(LanguageDetector) // Détection automatique de la langue
  .use(initReactI18next) // Intégration avec React
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // non nécessaire pour React
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
```

```json
// public/locales/fr/common.json
{
  "app": {
    "title": "Bibliothèque Virtuelle",
    "subtitle": "Réservez et empruntez vos documents préférés"
  },
  "nav": {
    "home": "Accueil",
    "catalog": "Catalogue",
    "account": "Mon Compte",
    "login": "Connexion",
    "register": "Inscription",
    "logout": "Déconnexion"
  },
  "book": {
    "author": "Auteur",
    "publishedYear": "Année de publication",
    "available": "Disponible",
    "unavailable": "Indisponible",
    "reserve": "Réserver"
  }
}
```

```json
// public/locales/en/common.json
{
  "app": {
    "title": "Virtual Library",
    "subtitle": "Reserve and borrow your favorite documents"
  },
  "nav": {
    "home": "Home",
    "catalog": "Catalog",
    "account": "My Account",
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  },
  "book": {
    "author": "Author",
    "publishedYear": "Published in",
    "available": "Available",
    "unavailable": "Unavailable",
    "reserve": "Reserve"
  }
}
```

### Configuration de Firebase

```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

```
// .env.example (à copier vers .env avec les vraies valeurs)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Service d'Authentification

```javascript
// src/services/firebase/auth.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../config/firebase';

export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
```

### Hook d'Authentification

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Récupérer les données utilisateur depuis Firestore
        try {
          const docRef = doc(firestore, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Créer un nouveau profil utilisateur si c'est la première connexion
            const newUserData = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              role: 'user',
              createdAt: new Date(),
            };
            
            await setDoc(docRef, newUserData);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading };
};
```

### Composant pour le Changement de Thème

```jsx
// src/components/common/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full ${
          theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Thème clair"
      >
        <SunIcon className="w-5 h-5 text-yellow-500" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full ${
          theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Thème sombre"
      >
        <MoonIcon className="w-5 h-5 text-blue-500" />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full ${
          theme === 'system' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Thème système"
      >
        <ComputerDesktopIcon className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};
```

### Composant pour le Changement de Langue

```jsx
// src/components/common/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === 'fr' 
            ? 'bg-primary-light dark:bg-primary-dark text-white' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        FR
      </button>
      
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm rounded ${
          i18n.language === 'en' 
            ? 'bg-primary-light dark:bg-primary-dark text-white' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};
```

## 4. Structure Firestore

Voici une proposition de structure pour votre base de données Firestore:

```
firestore/
├── users/                  # Collection des utilisateurs
│   ├── [userId]/           # Document utilisateur
│   │   ├── role: string    # 'user' ou 'admin'
│   │   ├── displayName: string
│   │   ├── email: string
│   │   ├── createdAt: timestamp
│   │   └── settings/       # Sous-collection pour les préférences utilisateur
│   │       ├── theme: string
│   │       └── language: string
│
├── books/                  # Collection des livres/documents
│   ├── [bookId]/           # Document livre
│   │   ├── title: string
│   │   ├── author: string
│   │   ├── description: string
│   │   ├── coverURL: string
│   │   ├── category: string
│   │   ├── tags: array
│   │   ├── available: boolean
│   │   ├── location: string
│   │   ├── publishedYear: number
│   │   └── translations/   # Sous-collection pour les traductions
│   │       ├── fr/
│   │       │   ├── title: string
│   │       │   └── description: string
│   │       └── en/
│   │           ├── title: string
│   │           └── description: string
│
├── reservations/           # Collection des réservations
│   ├── [reservationId]/    # Document réservation
│   │   ├── bookId: string  # Référence au livre
│   │   ├── userId: string  # Référence à l'utilisateur
│   │   ├── reservationDate: timestamp
│   │   ├── pickupDate: timestamp
│   │   └── status: string  # 'pending', 'ready', 'completed', 'cancelled'
│
└── categories/             # Collection des catégories
    ├── [categoryId]/       # Document catégorie
    │   ├── name: string
    │   ├── description: string
    │   └── translations/   # Sous-collection pour les traductions
    │       ├── fr/
    │       │   ├── name: string
    │       │   └── description: string
    │       └── en/
    │           ├── name: string
    │           └── description: string
```

## 5. Intégration dans App.jsx

```jsx
// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './router';
import './config/i18n'; // Initialiser i18next

// Créer un client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## 6. Sécurité avec Routes Protégées

```jsx
// src/components/layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && userData?.role !== 'admin') {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

## 7. Configuration du Router

```jsx
// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BookDetail from './pages/BookDetail';
import Reservation from './pages/Reservation';
import UserAccount from './pages/UserAccount';
import Admin from './pages/Admin';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Routes publiques
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'book/:id', element: <BookDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      
      // Routes protégées (utilisateur connecté)
      { 
        path: 'reservation', 
        element: <ProtectedRoute><Reservation /></ProtectedRoute> 
      },
      { 
        path: 'account', 
        element: <ProtectedRoute><UserAccount /></ProtectedRoute> 
      },
      
      // Routes protégées (admin uniquement)
      { 
        path: 'admin', 
        element: <ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute> 
      },
    ],
  },
]);
```

## 8. Configuration Firebase Hosting

```json
// firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autoriser l'accès authentifié aux données utilisateur
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tous les utilisateurs peuvent lire les livres
    match /books/{bookId} {
      allow read: if true;
      // Seuls les administrateurs peuvent modifier les livres
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Réservations
    match /reservations/{reservationId} {
      // Les utilisateurs peuvent lire leurs propres réservations
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      // Les utilisateurs peuvent créer des réservations
      allow create: if request.auth != null;
      // Les utilisateurs peuvent modifier uniquement leurs propres réservations
      allow update, delete: if request.auth != null && 
                           (resource.data.userId == request.auth.uid || 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Catégories (lecture publique, écriture admin)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

```
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Autoriser les images publiques pour les couvertures de livres
    match /books/{bookId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.resource.contentType.matches('image/.*') && 
                    request.resource.size < 5 * 1024 * 1024;
    }
    
    // Autoriser les images de profil utilisateur
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.uid == userId && 
                    request.resource.contentType.matches('image/.*') && 
                    request.resource.size < 2 * 1024 * 1024;
    }
  }
}
```

## 9. Exemple de Store avec Zustand

```javascript
// src/store/bookStore.js
import { create } from 'zustand';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useBookStore = create((set, get) => ({
  books: [],
  filteredBooks: [],
  isLoading: false,
  error: null,
  
  // Récupérer tous les livres
  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const booksRef = collection(firestore, 'books');
      const snapshot = await getDocs(booksRef);
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ books: booksData, filteredBooks: booksData, isLoading: false });
    } catch (error) {
      console.error('Error fetching books:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Filtrer les livres par catégorie
  filterByCategory: (category) => {
    const { books } = get();
    if (category === 'all') {
      set({ filteredBooks: books });
    } else {
      const filtered = books.filter(book => book.category === category);
      set({ filteredBooks: filtered });
    }
  },
  
  // Rechercher des livres
  searchBooks: (query) => {
    const { books } = get();
    if (!query) {
      set({ filteredBooks: books });
    } else {
      const searchQuery = query.toLowerCase();
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery) || 
        book.author.toLowerCase().includes(searchQuery)
      );
      set({ filteredBooks: filtered });
    }
  },
}));
```

## 10. Déploiement

```bash
# Construire le projet pour la production
npm run build

# Déployer sur Firebase
firebase deploy
```
