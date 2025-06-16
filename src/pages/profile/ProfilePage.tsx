// src/pages/profile/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth/authService';
import { BiblioUser } from '../../types/auth';
import { UserCircle, Shield } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs, { ProfileTabType } from '../../components/profile/ProfileTabs';
import PersonalInfo from '../../components/profile/PersonalInfo';
import SecuritySettings from '../../components/profile/SecuritySettings';

const ProfilePage = () => {
    const [user, setUser] = useState<BiblioUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTabType>('personal');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleEditPhoto = () => {
        console.log('Modifier la photo de profil');
    };

    const handleEditProfile = () => {
        setActiveTab('personal');
    };

    const handleSavePersonalInfo = async (updatedData: Partial<BiblioUser>) => {
        try {
            // Utiliser updateUserProfile au lieu de updateProfile
            await authService.updateUserProfile(updatedData);

            // Mettre à jour l'état local
            setUser(prev => prev ? { ...prev, ...updatedData } : null);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            throw error;
        }
    };

    const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
        try {
            await authService.changePassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            throw error;
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const password = prompt('Veuillez saisir votre mot de passe pour confirmer la suppression du compte :');
            if (!password) {
                throw new Error('Mot de passe requis pour supprimer le compte');
            }

            await authService.deleteAccount(password);

            // Rediriger vers la page d'accueil après suppression
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            throw error;
        }
    };

    const tabs = [
        {
            id: 'personal' as ProfileTabType,
            label: 'Informations Personnelles',
            icon: <UserCircle size={20} />,
            description: 'Gérer vos données personnelles'
        },
        {
            id: 'security' as ProfileTabType,
            label: 'Sécurité',
            icon: <Shield size={20} />,
            description: 'Mot de passe et sécurité'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Chargement du profil..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
                    <p className="text-gray-600">Impossible de charger les informations du profil.</p>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <PersonalInfo
                        user={user}
                        onSave={handleSavePersonalInfo}
                    />
                );
            case 'security':
                return (
                    <SecuritySettings
                        onPasswordChange={handlePasswordChange}
                        onDeleteAccount={handleDeleteAccount}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* En-tête du profil */}
            <ProfileHeader
                user={user}
                onEditPhoto={handleEditPhoto}
                onEditProfile={handleEditProfile}
            />

            {/* Onglets de navigation */}
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
            />

            {/* Contenu des onglets */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <div className="p-6 md:p-8 lg:p-10">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
