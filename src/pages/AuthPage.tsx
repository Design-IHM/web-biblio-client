import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import EmailVerification from '../components/auth/EmailVerification';
import { authService } from '../services/auth/authService';

type AuthMode = 'login' | 'register' | 'verify-email' | 'reset-password';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [emailToVerify, setEmailToVerify] = useState<string>('');

    // Gestion du succès de connexion
    const handleLoginSuccess = () => {
        navigate('/', { replace: true });
    };

    // Gestion du succès d'inscription
    const handleRegisterSuccess = (email: string) => {
        setEmailToVerify(email);
        setMode('verify-email');
    };

    // Gestion du renvoi d'email de vérification
    const handleResendVerificationEmail = async () => {
        try {
            await authService.sendEmailVerification();
        } catch (error) {
            console.error('❌ Erreur renvoi email:', error);
            throw error;
        }
    };

    // Gestion du retour à la connexion
    const handleBackToLogin = () => {
        setMode('login');
        setEmailToVerify('');
    };

    // Gestion du mot de passe oublié
    const handleForgotPassword = async (email: string) => {
        try {
            await authService.resetPassword(email);
        } catch (error) {
            console.error('❌ Erreur reset password:', error);
        }
    };

    return (
        <div className="min-h-screen">
            {mode === 'login' && (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <LoginForm
                        onSuccess={handleLoginSuccess}
                        onSwitchToRegister={() => setMode('register')}
                        onForgotPassword={handleForgotPassword}
                    />
                </div>
            )}

            {mode === 'register' && (
                <RegisterForm
                    onSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => setMode('login')}
                />
            )}

            {mode === 'verify-email' && (
                <EmailVerification
                    email={emailToVerify}
                    onResendEmail={handleResendVerificationEmail}
                    onBackToLogin={handleBackToLogin}
                />
            )}
        </div>
    );
};

export default AuthPage;
