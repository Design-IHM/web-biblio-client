import React, { useState, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { EmailVerificationProps } from '../../types/auth';
import Button from '../ui/Button';
import { Mail, CheckCircle, Clock, RefreshCw, ArrowLeft } from 'lucide-react';

const EmailVerification: React.FC<EmailVerificationProps> = ({
                                                                 email,
                                                                 onResendEmail,
                                                                 onBackToLogin
                                                             }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [emailSent, setEmailSent] = useState(true);

    // Cooldown pour le renvoi d'email
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleResendEmail = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        try {
            await onResendEmail();
            setEmailSent(true);
            setResendCooldown(60); // 60 secondes de cooldown
        } catch (error) {
            console.error('Erreur renvoi email:', error);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Animation d'icône */}
                    <div className="relative mb-8">
                        <div
                            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative overflow-hidden"
                            style={{ backgroundColor: `${primaryColor}10` }}
                        >
                            <Mail
                                className="h-12 w-12 animate-pulse"
                                style={{ color: primaryColor }}
                            />

                            {/* Animation de cercles */}
                            <div
                                className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                                style={{
                                    borderTopColor: primaryColor,
                                    animationDuration: '2s'
                                }}
                            ></div>
                            <div
                                className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
                                style={{
                                    borderRightColor: `${primaryColor}60`,
                                    animationDuration: '1.5s',
                                    animationDirection: 'reverse'
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Titre et description */}
                    <h1 className="text-3xl font-bold mb-4" style={{ color: secondaryColor }}>
                        Vérifiez votre email
                    </h1>

                    <p className="text-gray-600 mb-2">
                        Nous avons envoyé un lien de vérification à :
                    </p>

                    <p className="font-semibold mb-6" style={{ color: primaryColor }}>
                        {email}
                    </p>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Étapes à suivre :
                        </h3>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>Ouvrez votre boîte email</li>
                            <li>Cherchez l'email de {organizationName}</li>
                            <li>Cliquez sur le lien de vérification</li>
                            <li>Revenez ici pour vous connecter</li>
                        </ol>
                    </div>

                    {/* Statut d'envoi */}
                    {emailSent && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                            <p className="text-green-700 text-sm flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Email de vérification envoyé avec succès !
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-4">
                        {/* Bouton de renvoi */}
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={handleResendEmail}
                            loading={resendLoading}
                            disabled={resendCooldown > 0}
                            leftIcon={<RefreshCw className="h-5 w-5" />}
                        >
                            {resendCooldown > 0
                                ? `Renvoyer dans ${resendCooldown}s`
                                : resendLoading
                                    ? 'Envoi en cours...'
                                    : 'Renvoyer l\'email'
                            }
                        </Button>

                        {/* Bouton retour */}
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={onBackToLogin}
                            leftIcon={<ArrowLeft className="h-5 w-5" />}
                        >
                            Retour à la connexion
                        </Button>
                    </div>

                    {/* Aide supplémentaire */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            Vous ne trouvez pas l'email ?
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p className="flex items-start">
                                <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                                Patientez quelques minutes, l'email peut prendre du temps à arriver
                            </p>
                            <p className="flex items-start">
                                <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                                Vérifiez votre dossier spam ou courrier indésirable
                            </p>
                        </div>
                    </div>

                    {/* Contact support */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Besoin d'aide ? Contactez-nous à{' '}
                            <a
                                href={`mailto:${orgSettings?.Contact?.Email || 'support@biblioenspy.com'}`}
                                className="font-medium hover:underline"
                                style={{ color: primaryColor }}
                            >
                                {orgSettings?.Contact?.Email || 'support@biblioenspy.com'}
                            </a>
                        </p>
                    </div>
                </div>

                {/* Animation de background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                    <div
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5 animate-pulse"
                        style={{
                            backgroundColor: secondaryColor,
                            animationDelay: '1s'
                        }}
                    ></div>
                    <div
                        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-5 animate-pulse"
                        style={{
                            backgroundColor: primaryColor,
                            animationDelay: '2s'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
