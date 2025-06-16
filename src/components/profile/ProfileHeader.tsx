import React from 'react';
import { BiblioUser } from '../../types/auth';
import { useConfig } from '../../contexts/ConfigContext';
import { Camera, Edit, Calendar, Phone, Mail, GraduationCap, Building } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {Timestamp} from "firebase/firestore";

interface ProfileHeaderProps {
    user: BiblioUser;
    onEditPhoto?: () => void;
    onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                         user,
                                                         onEditPhoto,
                                                         onEditProfile
                                                     }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    const formatDate = (timestamp: Timestamp | Date | string | null | undefined): string => {
        if (!timestamp) return 'Non défini';

        const date = (timestamp instanceof Timestamp)
            ? timestamp.toDate()
            : new Date(timestamp);

        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card variant="glass" padding="lg" className="relative overflow-hidden">
            {/* Arrière-plan décoratif */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
            />

            {/* Motifs décoratifs */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5">
                <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                {/* Photo de profil */}
                <div className="relative group">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>

                    {/* Bouton d'édition de photo */}
                    <button
                        onClick={onEditPhoto}
                        className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group-hover:opacity-100 opacity-90 cursor-pointer"
                        style={{ color: primaryColor }}
                    >
                        <Camera size={16} className="lg:w-5 lg:h-5" />
                    </button>
                </div>

                {/* Informations principales */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: secondaryColor }}>
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge
                                    variant="primary"
                                    size="md"
                                >
                                    {user.statut === 'etudiant' ? 'Étudiant(e)' : 'Enseignant(e)'}
                                </Badge>
                                {user.niveau && (
                                    <Badge variant="secondary" size="md">
                                        {user.niveau.toUpperCase()}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={onEditProfile}
                            variant="outline"
                            size="sm"
                            leftIcon={<Edit size={16} />}
                            className="self-start cursor-pointer"
                        >
                            Modifier le profil
                        </Button>
                    </div>

                    {/* Informations détaillées */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {user.email && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Mail size={16} style={{ color: primaryColor }} />
                                <span className="truncate">{user.email}</span>
                            </div>
                        )}

                        {user.tel && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Phone size={16} style={{ color: primaryColor }} />
                                <span>{user.tel}</span>
                            </div>
                        )}

                        {user.matricule && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <GraduationCap size={16} style={{ color: primaryColor }} />
                                <span>Matricule: {user.matricule}</span>
                            </div>
                        )}

                        {user.departement && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Building size={16} style={{ color: primaryColor }} />
                                <span className="truncate">{user.departement}</span>
                            </div>
                        )}

                        {user.createdAt && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar size={16} style={{ color: primaryColor }} />
                                <span>Inscrit le {formatDate(user.createdAt)}</span>
                            </div>
                        )}

                        {user.lastLoginAt && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar size={16} style={{ color: primaryColor }} />
                                <span>Dernière connexion: {formatDate(user.lastLoginAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;
