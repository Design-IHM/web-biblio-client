import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Shield, Lock, Key, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SecuritySettingsProps {
    onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
    onDeleteAccount?: () => Promise<void>;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
                                                               onPasswordChange,
                                                               onDeleteAccount
                                                           }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        setMessage(null);
    };

    const handleSubmitPasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!onPasswordChange) return;

        // Validation
        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        setLoading(true);
        try {
            await onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de la modification du mot de passe' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!onDeleteAccount) return;

        const confirmed = window.confirm(
            'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données.'
        );

        if (confirmed) {
            try {
                await onDeleteAccount();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setMessage({ type: 'error', text: error.message });
                }else {
                    setMessage({type: 'error', text: 'Erreur lors de la suppression du compte'});
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Changement de mot de passe */}
            <Card variant="elevated" padding="lg">
                <div className="flex items-center space-x-3 mb-6">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                    >
                        <Lock size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: secondaryColor }}>
                            Changer le mot de passe
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Mettez à jour votre mot de passe pour sécuriser votre compte
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                        message.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle size={20} className="text-green-600" />
                        ) : (
                            <AlertTriangle size={20} className="text-red-600" />
                        )}
                        <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
                    </div>
                )}

                <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
                    <Input
                        label="Mot de passe actuel"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange('currentPassword')}
                        leftIcon={<Key size={18} />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="cursor-pointer"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                        placeholder="Votre mot de passe actuel"
                        required
                    />

                    <Input
                        label="Nouveau mot de passe"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange('newPassword')}
                        leftIcon={<Lock size={18} />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="cursor-pointer"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                        placeholder="Votre nouveau mot de passe"
                        helperText="Au moins 6 caractères"
                        required
                    />

                    <Input
                        label="Confirmer le nouveau mot de passe"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange('confirmPassword')}
                        leftIcon={<Lock size={18} />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                        placeholder="Confirmer votre nouveau mot de passe"
                        required
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="cursor-pointer"
                        >
                            Changer le mot de passe
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Informations de sécurité */}
            <Card variant="elevated" padding="lg">
                <div className="flex items-center space-x-3 mb-6">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                    >
                        <Shield size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: secondaryColor }}>
                            Sécurité du compte
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Informations sur la sécurité de votre compte
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                            <p className="text-sm text-gray-600">Sécurisez votre compte avec une authentification supplémentaire</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            disabled
                        >
                            Bientôt disponible
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Sessions actives</h4>
                            <p className="text-sm text-gray-600">Gérez les appareils connectés à votre compte</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            disabled
                        >
                            Voir les sessions
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Zone de danger */}
            <Card variant="elevated" padding="lg" className="border-red-200">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                        <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-600">
                            Zone de danger
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Actions irréversibles concernant votre compte
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-red-900">Supprimer mon compte</h4>
                            <p className="text-sm text-red-700">
                                Cette action est irréversible et supprimera toutes vos données
                            </p>
                        </div>
                        <Button
                            onClick={handleDeleteAccount}
                            variant="primary"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 border-red-600 cursor-pointer"
                        >
                            Supprimer le compte
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SecuritySettings;
