import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth/authService';
import { BiblioUser } from '../../types/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useConfig } from '../../contexts/ConfigContext';
import { Camera, Edit, Shield, Bell, UserCircle, ChevronRight, Check, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Removed for artifact compatibility

type ProfileTab = 'personal' | 'security' | 'notifications';

const ProfilePage = () => {
    const [user, setUser] = useState<BiblioUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
    // const navigate = useNavigate(); // Removed for artifact compatibility
    const { orgSettings } = useConfig();

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    // Helper function to darken color
    const darkenColor = (color: string, percent: number = 20) => {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const primaryColorDark = darkenColor(primaryColor);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                } else {
                    // navigate('/auth'); // Removed for artifact compatibility
                    console.log('Redirect to auth');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
                // navigate('/auth'); // Removed for artifact compatibility
                console.log('Redirect to auth');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Removed navigate dependency for artifact compatibility

    // Composant bouton d'onglet moderne
    const TabButton = ({ icon, label, isActive, onClick }: { icon: JSX.Element, label: string, isActive: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all duration-300 rounded-xl relative overflow-hidden ${
                isActive
                    ? 'text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
            style={{
                background: isActive ? `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})` : 'transparent'
            }}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {icon}
            </div>
            <span className="hidden md:inline whitespace-nowrap">{label}</span>
            {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
            )}
        </button>
    );

    // Composant champ d'information redesigné
    const InfoField = ({ label, value, editable = true, icon }: { label: string, value: string, editable?: boolean, icon?: JSX.Element }) => (
        <div className="group">
            <label className="text-sm font-semibold text-gray-600 mb-2 block">{label}</label>
            <div className={`relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 p-4 transition-all duration-300 ${
                editable ? 'hover:border-indigo-300 hover:shadow-md cursor-pointer' : ''
            } group-hover:transform group-hover:scale-[1.02]`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-gray-500">{icon}</div>}
                        <p className="text-gray-800 font-medium">{value}</p>
                    </div>
                    {editable && (
                        <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-lg hover:bg-white/80"
                            style={{ color: primaryColor }}
                        >
                            <Edit size={16} />
                        </button>
                    )}
                </div>
                {editable && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
            </div>
        </div>
    );

    // Composant informations personnelles
    const PersonalInformation = ({ user }: { user: BiblioUser }) => (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Informations Personnelles</h3>
                <p className="text-gray-600">Gérez vos informations de profil et vos préférences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Nom Complet" value={user.name} icon={<UserCircle size={20} />} />
                <InfoField label="Adresse Email" value={user.email} editable={false} />
                <InfoField label="Matricule" value={user.matricule} editable={false} />
                <InfoField label="Téléphone" value={user.tel} />
                <InfoField label="Département" value={user.departement || 'Non spécifié'} editable={false} />
                <InfoField label="Niveau" value={user.niveau ? user.niveau.toUpperCase() : 'Non spécifié'} editable={false} />
                <InfoField label="Date d'inscription" value={user.createdAt.toDate().toLocaleDateString('fr-FR')} editable={false} />
                <InfoField label="Dernière connexion" value={user.lastLoginAt.toDate().toLocaleString('fr-FR')} editable={false} />
            </div>
        </div>
    );

    // Composant carte de sécurité
    const SecurityCard = ({ title, description, buttonText, buttonColor, icon }: {
        title: string;
        description: string;
        buttonText: string;
        buttonColor: string;
        icon: JSX.Element;
    }) => (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start gap-4">
                <div
                    className="p-3 rounded-xl text-white shadow-lg"
                    style={{ backgroundColor: buttonColor }}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
                    <button
                        className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: buttonColor }}
                    >
                        {buttonText}
                        <ChevronRight size={16} className="inline ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );

    // Composant paramètres de sécurité
    const SecuritySettings = () => (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Sécurité du Compte</h3>
                <p className="text-gray-600">Protégez votre compte avec des mesures de sécurité avancées</p>
            </div>

            <div className="grid gap-6">
                <SecurityCard
                    title="Changer le mot de passe"
                    description="Utilisez un mot de passe fort et unique pour protéger votre compte"
                    buttonText="Mettre à jour"
                    buttonColor={primaryColor}
                    icon={<Shield size={24} />}
                />
                <SecurityCard
                    title="Authentification à deux facteurs"
                    description="Ajoutez une couche de sécurité supplémentaire avec la vérification en deux étapes"
                    buttonText="Activer le 2FA"
                    buttonColor={secondaryColor}
                    icon={<Check size={24} />}
                />
            </div>
        </div>
    );

    // Composant toggle de notification moderne
    const NotificationToggle = ({ title, description, isActive }: { title: string, description: string, isActive: boolean }) => {
        const [checked, setChecked] = useState(isActive);

        return (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md group">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                        <p className="text-gray-600 leading-relaxed">{description}</p>
                    </div>
                    <div className="ml-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className={`w-14 h-8 rounded-full peer transition-all duration-300 ${
                                checked ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' : 'bg-gray-300'
                            } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/50 relative`}>
                                <div className={`absolute top-1 left-1 bg-white rounded-full h-6 w-6 transition-transform duration-300 shadow-md ${
                                    checked ? 'translate-x-6' : 'translate-x-0'
                                }`}></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    // Composant paramètres de notifications
    const NotificationSettings = () => (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Préférences de Notification</h3>
                <p className="text-gray-600">Personnalisez vos notifications pour rester informé</p>
            </div>

            <div className="space-y-4">
                <NotificationToggle
                    title="Notifications par Email"
                    description="Recevez des rappels d'emprunt, confirmations de réservation et alertes importantes"
                    isActive={true}
                />
                <NotificationToggle
                    title="Newsletter de la bibliothèque"
                    description="Restez informé des nouveautés, événements spéciaux et annonces de la bibliothèque"
                    isActive={true}
                />
                <NotificationToggle
                    title="Alertes de disponibilité"
                    description="Soyez notifié instantanément quand un livre de votre liste d'attente devient disponible"
                    isActive={false}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <LoadingSpinner size="lg" text="Chargement du profil..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Utilisateur non trouvé</h2>
                    <p className="text-gray-500">Veuillez vous reconnecter à votre compte.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-4 md:p-6 lg:p-8"
            style={{
                background: `linear-gradient(to bottom right, #f8fafc, ${primaryColor}20, ${secondaryColor}10)`
            }}
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header avec avatar et informations principales */}
                <div
                    className="relative overflow-hidden rounded-3xl shadow-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${secondaryColor} 100%)`
                    }}
                >
                    {/* Éléments décoratifs */}
                    <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
                        <div className="w-full h-full bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5">
                        <div className="w-full h-full bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Avatar avec overlay au hover */}
                            <div className="relative group">
                                <div className="relative">
                                    <img
                                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=ffffff&color=${primaryColor.replace('#', '')}&size=200&font-size=0.4`}
                                        alt="Avatar"
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Informations utilisateur */}
                            <div className="text-center lg:text-left text-white flex-1">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
                                    {user.name}
                                </h1>
                                <p className="text-lg md:text-xl text-white/80 mb-4 font-medium">
                                    {user.email}
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <span
                                        className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30"
                                    >
                                        {user.statut === 'etudiant' ? `Étudiant(e) - ${user.niveau ? user.niveau.toUpperCase() : 'N/A'}` : 'Enseignant(e)'}
                                    </span>
                                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                                        {user.departement || 'Non spécifié'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation des onglets */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-2">
                    <div className="flex space-x-1">
                        <TabButton
                            icon={<UserCircle size={20} />}
                            label="Informations Personnelles"
                            isActive={activeTab === 'personal'}
                            onClick={() => setActiveTab('personal')}
                        />
                        <TabButton
                            icon={<Shield size={20} />}
                            label="Sécurité"
                            isActive={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                        />
                        <TabButton
                            icon={<Bell size={20} />}
                            label="Notifications"
                            isActive={activeTab === 'notifications'}
                            onClick={() => setActiveTab('notifications')}
                        />
                    </div>
                </div>

                {/* Contenu des onglets */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="p-6 md:p-8 lg:p-10">
                        {activeTab === 'personal' && <PersonalInformation user={user} />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
