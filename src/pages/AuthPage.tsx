import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useConfig } from '../contexts/ConfigContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import EmailVerification from '../components/auth/EmailVerification';
import { authService } from '../services/auth/authService';

type AuthMode = 'login' | 'register' | 'verification' | 'forgot-password';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const { orgSettings, isLoading: configLoading } = useConfig();

    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [verificationEmail, setVerificationEmail] = useState('');
    const [pageLoading, setPageLoading] = useState(true);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    // Vérifier l'état d'authentification au chargement
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                // Utilisateur connecté et email vérifié, rediriger vers l'accueil
                navigate('/', { replace: true });
            } else if (user && !user.emailVerified) {
                // Utilisateur connecté mais email non vérifié
                setVerificationEmail(user.email || '');
                setAuthMode('verification');
            }
            setPageLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    // Gestion du succès de connexion
    const handleLoginSuccess = () => {
        const user = auth.currentUser;
        if (user?.emailVerified) {
            navigate('/', { replace: true });
        } else if (user) {
            setVerificationEmail(user.email || '');
            setAuthMode('verification');
        }
    };

    // Gestion du succès d'inscription
    const handleRegisterSuccess = (email: string) => {
        setVerificationEmail(email);
        setAuthMode('verification');
    };

    // Gestion du renvoi d'email de vérification
    const handleResendVerification = async () => {
        try {
            await authService.sendEmailVerification();
        } catch (error) {
            console.error('Erreur renvoi email:', error);
            throw error;
        }
    };

    // Gestion du mot de passe oublié
    const handleForgotPassword = async (email: string) => {
        try {
            await authService.resetPassword(email);
            // Afficher un message de succès ou rediriger
            alert('Email de réinitialisation envoyé !');
        } catch (error) {
            console.error('Erreur reset password:', error);
            alert('Erreur lors de l\'envoi de l\'email');
        }
    };

    // Retour à la connexion depuis la vérification
    const handleBackToLogin = () => {
        setAuthMode('login');
        setVerificationEmail('');
    };

    // Affichage du loader pendant le chargement des configurations
    if (configLoading || pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <LoadingSpinner
                    size="xl"
                    text="Chargement..."
                    fullScreen
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Logo en haut à gauche */}
            <div className="absolute top-6 left-6 z-10">
                <div className="flex items-center space-x-3">
                    {orgSettings?.Logo && (
                        <img
                            src={orgSettings.Logo}
                            alt={organizationName}
                            className="h-10 w-10 object-contain"
                        />
                    )}
                    <span
                        className="text-xl font-bold hidden sm:block"
                        style={{ color: secondaryColor }}
                    >
                        {organizationName}
                    </span>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-7xl">
                    <div className="items-center justify-center w-3/4 mx-auto">

                        <div className="w-full lg:col-span-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 xl:p-10">
                                {authMode === 'login' && (
                                    <LoginForm
                                        onSuccess={handleLoginSuccess}
                                        onSwitchToRegister={() => setAuthMode('register')}
                                        onForgotPassword={handleForgotPassword}
                                    />
                                )}

                                {authMode === 'register' && (
                                    <RegisterForm
                                        onSuccess={handleRegisterSuccess}
                                        onSwitchToLogin={() => setAuthMode('login')}
                                    />
                                )}

                                {authMode === 'verification' && (
                                    <EmailVerification
                                        email={verificationEmail}
                                        onResendEmail={handleResendVerification}
                                        onBackToLogin={handleBackToLogin}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Éléments décoratifs de fond */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div
                    className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-5 animate-pulse"
                    style={{ backgroundColor: primaryColor }}
                ></div>
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5 animate-pulse"
                    style={{
                        backgroundColor: secondaryColor,
                        animationDelay: '2s'
                    }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-3 animate-pulse"
                    style={{
                        backgroundColor: primaryColor,
                        animationDelay: '4s'
                    }}
                ></div>
            </div>

            {/* Footer mobile */}
            <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} {organizationName}. Tous droits réservés.
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
