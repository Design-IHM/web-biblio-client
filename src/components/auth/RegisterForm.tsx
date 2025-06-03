import React, { useState, useCallback } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { RegisterFormData, ACADEMIC_LEVELS, FormErrors } from '../../types/auth';
import { authService } from '../../services/auth/authService';

// Import des composants UI
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import AvatarUploader from '../common/AvatarUploader';

// Import des icônes
import {
    User,
    Mail,
    Lock,
    Phone,
    Eye,
    EyeOff,
    GraduationCap,
    Users,
    UserCheck,
    ArrowLeft
} from 'lucide-react';

interface RegisterFormProps {
    onSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    // États du formulaire
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        matricule: '',
        tel: '',
        statut: 'etudiant',
        departement: '',
        niveau: '',
        profilePicture: undefined
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    // Validation du formulaire
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Validation du nom
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'L\'email est requis';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Validation du matricule
        if (!formData.matricule.trim()) {
            newErrors.matricule = 'Le matricule est requis';
        } else if (formData.matricule.trim().length < 6) {
            newErrors.matricule = 'Le matricule doit contenir au moins 6 caractères';
        }

        // Validation du téléphone
        const phoneRegex = /^[+]?[0-9]{8,}$/;
        if (!formData.tel) {
            newErrors.tel = 'Le numéro de téléphone est requis';
        } else if (!phoneRegex.test(formData.tel)) {
            newErrors.tel = 'Format de téléphone invalide';
        }

        // Validation du mot de passe
        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        // Validation de la confirmation du mot de passe
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Validation pour les étudiants
        if (formData.statut === 'etudiant') {
            if (!formData.departement) {
                newErrors.departement = 'Le département est requis pour les étudiants';
            }
            if (!formData.niveau) {
                newErrors.niveau = 'Le niveau est requis pour les étudiants';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Gestion des changements de champs
    const handleInputChange = (field: keyof RegisterFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Nettoyer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Réinitialiser les champs département et niveau si on change de statut
        if (field === 'statut' && value === 'enseignant') {
            setFormData(prev => ({ ...prev, departement: '', niveau: '' }));
            setErrors(prev => ({ ...prev, departement: '', niveau: '' }));
        }
    };

    // Gestion de l'upload d'avatar
    const handleAvatarUploaded = useCallback((url: string) => {
        setAvatarUrl(url);
        setFormData(prev => ({
            ...prev,
            profilePicture: url
        }));

        // Nettoyer l'erreur de photo de profil si elle existe
        if (errors.profilePicture) {
            setErrors(prev => ({
                ...prev,
                profilePicture: ''
            }));
        }
    }, [errors.profilePicture]);

    const handleAvatarRemoved = useCallback(() => {
        setAvatarUrl('');
        setFormData(prev => ({
            ...prev,
            profilePicture: undefined
        }));
    }, []);

    // Switch de statut
    const handleStatusSwitch = (status: 'etudiant' | 'enseignant') => {
        setFormData(prev => ({ ...prev, statut: status }));
        if (status === 'enseignant') {
            setFormData(prev => ({ ...prev, departement: '', niveau: '' }));
            setErrors(prev => ({ ...prev, departement: '', niveau: '' }));
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authService.signUp(formData);

            if (response.success) {
                onSuccess(formData.email);
            } else {
                setErrors({ general: response.message || 'Erreur lors de l\'inscription' });
            }
        } catch (error: unknown) {
            console.error('Erreur inscription:', error);
            setErrors({ general: 'Une erreur inattendue s\'est produite' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-8">
                <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                >
                    <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold" style={{ color: secondaryColor }}>
                    Rejoindre {organizationName}
                </h1>
                <p className="text-gray-600 mt-2">
                    Créez votre compte pour accéder à notre bibliothèque
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Erreur générale */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                    </div>
                )}

                {/* Photo de profil */}
                <div className="flex justify-center">
                    <AvatarUploader
                        currentAvatar={avatarUrl}
                        onAvatarUploaded={handleAvatarUploaded}
                        onAvatarRemoved={handleAvatarRemoved}
                        size="lg"
                        userName={formData.name}
                        userId="temp-user"
                    />
                </div>

                {/* Switch Statut */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Vous êtes *
                    </label>
                    <div className="relative bg-white rounded-lg p-1 border-2 border-gray-200 shadow-sm max-w-md mx-auto">
                        <div
                            className="absolute top-1 bottom-1 w-1/2 rounded-md transition-all duration-300 ease-in-out shadow-sm"
                            style={{
                                left: formData.statut === 'etudiant' ? '4px' : '50%',
                                backgroundColor: primaryColor
                            }}
                        />
                        <div className="relative flex">
                            <button
                                type="button"
                                onClick={() => handleStatusSwitch('etudiant')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                                    formData.statut === 'etudiant'
                                        ? 'text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <GraduationCap className="h-5 w-5" />
                                <span>Étudiant(e)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusSwitch('enseignant')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                                    formData.statut === 'enseignant'
                                        ? 'text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <UserCheck className="h-5 w-5" />
                                <span>Enseignant(e)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center md:justify-start">
                        <User className="h-5 w-5 mr-2" style={{ color: primaryColor }} />
                        Informations personnelles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nom complet"
                            type="text"
                            placeholder="Votre nom complet"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            error={errors.name}
                            leftIcon={<User className="h-5 w-5" />}
                            required
                        />

                        <Input
                            label="Adresse email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            error={errors.email}
                            leftIcon={<Mail className="h-5 w-5" />}
                            required
                        />

                        <Input
                            label="Matricule"
                            type="text"
                            placeholder="Votre matricule"
                            value={formData.matricule}
                            onChange={handleInputChange('matricule')}
                            error={errors.matricule}
                            leftIcon={<Users className="h-5 w-5" />}
                            required
                        />

                        <Input
                            label="Numéro de téléphone"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            value={formData.tel}
                            onChange={handleInputChange('tel')}
                            error={errors.tel}
                            leftIcon={<Phone className="h-5 w-5" />}
                            required
                        />
                    </div>
                </div>

                {/* Champs conditionnels pour les étudiants */}
                {formData.statut === 'etudiant' && (
                    <div className="bg-blue-50 rounded-xl p-6 space-y-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center md:justify-start">
                            <GraduationCap className="h-5 w-5 mr-2" style={{ color: primaryColor }} />
                            Informations académiques
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/*<Select
                                label="Département"
                                placeholder="Sélectionnez votre département"
                                value={formData.departement || ''}
                                onChange={handleInputChange('departement')}
                                error={errors.departement}
                                options={[
                                    { value: 'informatique', label: 'Informatique' },
                                    { value: 'mathematiques', label: 'Mathématiques' },
                                    { value: 'physique', label: 'Physique' },
                                    { value: 'chimie', label: 'Chimie' },
                                    { value: 'biologie', label: 'Biologie' }
                                ]}
                                required
                            />*/}

                            <Select
                                label="Niveau d'études"
                                placeholder="Sélectionnez votre niveau"
                                value={formData.niveau || ''}
                                onChange={handleInputChange('niveau')}
                                error={errors.niveau}
                                options={ACADEMIC_LEVELS.map(level => ({
                                    value: level.id,
                                    label: level.name
                                }))}
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Mots de passe */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center md:justify-start">
                        <Lock className="h-5 w-5 mr-2" style={{ color: primaryColor }} />
                        Sécurité
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Mot de passe"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Votre mot de passe"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            error={errors.password}
                            leftIcon={<Lock className="h-5 w-5" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                            autoComplete="new-password"
                            required
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmez votre mot de passe"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            error={errors.confirmPassword}
                            leftIcon={<Lock className="h-5 w-5" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                            autoComplete="new-password"
                            required
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        leftIcon={<GraduationCap className="h-5 w-5" />}
                        className="py-4 text-lg font-semibold"
                    >
                        {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                    </Button>

                    {/* Séparateur */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Vous avez déjà un compte ?
                            </span>
                        </div>
                    </div>

                    {/* Bouton de retour à la connexion */}
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        fullWidth
                        onClick={onSwitchToLogin}
                        leftIcon={<ArrowLeft className="h-5 w-5" />}
                    >
                        Retour à la connexion
                    </Button>
                </div>
            </form>

            {/* Informations supplémentaires */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3 text-center">
                    En rejoignant {organizationName}, vous bénéficiez de :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center md:justify-start">
                        <div
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: primaryColor }}
                        ></div>
                        <span className="text-gray-600">Accès à 25 000+ livres</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                        <div
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: primaryColor }}
                        ></div>
                        <span className="text-gray-600">Réservation en ligne 24h/24</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                        <div
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: primaryColor }}
                        ></div>
                        <span className="text-gray-600">Support client personnalisé</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
