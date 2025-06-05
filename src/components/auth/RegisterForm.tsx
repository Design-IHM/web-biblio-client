import React, { useState, useCallback } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { RegisterFormData, ACADEMIC_LEVELS, DEPARTMENTS, FormErrors } from '../../types/auth';
import { authService } from '../../services/auth/authService';

// Import des composants UI
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import AvatarUploader from '../common/AvatarUploader';

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
    BookOpen,
    Shield,
    Camera,
    CheckCircle
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
        } catch {
            setErrors({ general: 'Une erreur inattendue s\'est produite' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 px-4 flex items-center justify-center">
            <div className="w-full max-w-6xl">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div
                            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: secondaryColor }}>
                        Rejoindre {organizationName}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Créez votre compte et accédez à notre univers de connaissances
                    </p>
                    <div className="w-24 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                </div>

                {/* Card principale */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Erreur générale */}
                        {errors.general && (
                            <div className="m-6 mb-0 bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-red-800 font-medium">{errors.general}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8">
                            {/* Section Avatar & Statut */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <Camera className="h-6 w-6 mr-3" style={{ color: primaryColor }} />
                                    <h2 className="text-xl font-semibold text-gray-800">Profil & Statut</h2>
                                    <div className="flex-1 ml-4 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                                </div>

                                <div className="flex flex-col xl:flex-row xl:gap-8 xl:items-center">
                                    {/* Avatar */}
                                    <div className="flex-1 flex flex-col items-center xl:items-start">
                                        <div className="flex justify-center xl:justify-start w-full">
                                            <AvatarUploader
                                                currentAvatar={avatarUrl}
                                                onAvatarUploaded={handleAvatarUploaded}
                                                onAvatarRemoved={handleAvatarRemoved}
                                                size="xl"
                                                userName={formData.name}
                                                userId="temp-user"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-3 text-center xl:text-left max-w-xs">
                                            Ajoutez une photo de profil pour personnaliser votre compte
                                        </p>
                                    </div>

                                    {/* Séparateur vertical pour desktop */}
                                    <div className="hidden xl:flex xl:items-center xl:justify-center">
                                        <div
                                            className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"
                                            style={{ height: '200px' }}
                                        ></div>
                                    </div>

                                    {/* Séparateur horizontal pour mobile */}
                                    <div className="xl:hidden my-6">
                                        <div className="border-t border-gray-200"></div>
                                    </div>

                                    {/* Switch Statut */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center xl:text-left">
                                            Vous êtes <span style={{ color: primaryColor }}>*</span>
                                        </h3>
                                        <div className="relative">
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusSwitch('etudiant')}
                                                    className={`relative overflow-hidden group flex items-center justify-center cursor-pointer py-4 px-6 rounded-xl font-medium transition-all duration-300 border-2 ${
                                                        formData.statut === 'etudiant'
                                                            ? 'text-white shadow-lg transform scale-105'
                                                            : 'text-gray-600 border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                    style={{
                                                        backgroundColor: formData.statut === 'etudiant' ? primaryColor : undefined,
                                                        borderColor: formData.statut === 'etudiant' ? primaryColor : undefined
                                                    }}
                                                >
                                                    <GraduationCap className="h-5 w-5 mr-2" />
                                                    <span>Étudiant(e)</span>
                                                    {formData.statut === 'etudiant' && (
                                                        <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusSwitch('enseignant')}
                                                    className={`relative overflow-hidden group cursor-pointer flex items-center justify-center py-4 px-6 rounded-xl font-medium transition-all duration-300 border-2 ${
                                                        formData.statut === 'enseignant'
                                                            ? 'text-white shadow-lg transform scale-105'
                                                            : 'text-gray-600 border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                    style={{
                                                        backgroundColor: formData.statut === 'enseignant' ? secondaryColor : undefined,
                                                        borderColor: formData.statut === 'enseignant' ? secondaryColor : undefined
                                                    }}
                                                >
                                                    <UserCheck className="h-5 w-5 mr-2" />
                                                    <span>Enseignant(e)</span>
                                                    {formData.statut === 'enseignant' && (
                                                        <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="my-8 border-t border-gray-200"></div>

                            {/* Section Informations */}
                            <div className="flex flex-col xl:flex-row xl:gap-8">
                                {/* COLONNE GAUCHE */}
                                <div className="flex-1 space-y-6">
                                    {/* Informations personnelles */}
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <User className="h-6 w-6 mr-3" style={{ color: primaryColor }} />
                                            <h2 className="text-xl font-semibold text-gray-800">Informations personnelles</h2>
                                        </div>

                                        <div className="space-y-4">
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
                                </div>

                                {/* SÉPARATEUR VERTICAL */}
                                <div className="hidden xl:flex xl:items-center xl:justify-center xl:px-4">
                                    <div
                                        className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"
                                        style={{ height: '500px' }}
                                    ></div>
                                </div>

                                {/* SÉPARATEUR HORIZONTAL MOBILE */}
                                <div className="xl:hidden my-8">
                                    <div className="border-t border-gray-200"></div>
                                </div>

                                {/* COLONNE DROITE */}
                                <div className="flex-1 space-y-6">
                                    {/* Informations académiques pour étudiants */}
                                    {formData.statut === 'etudiant' && (
                                        <div>
                                            <div className="flex items-center mb-6">
                                                <GraduationCap className="h-6 w-6 mr-3" style={{ color: primaryColor }} />
                                                <h2 className="text-xl font-semibold text-gray-800">Informations académiques</h2>
                                            </div>

                                            <div className="space-y-4">
                                                <Select
                                                    label="Département"
                                                    placeholder="Sélectionnez votre département"
                                                    value={formData.departement || ''}
                                                    onChange={handleInputChange('departement')}
                                                    error={errors.departement}
                                                    options={DEPARTMENTS.map(dept => ({
                                                        value: dept.id,
                                                        label: dept.name
                                                    }))}
                                                    required
                                                />

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

                                    {/* Informations pour enseignants */}
                                    {formData.statut === 'enseignant' && (
                                        <div>
                                            <div className="flex items-center mb-6">
                                                <UserCheck className="h-6 w-6 mr-3" style={{ color: primaryColor }} />
                                                <h2 className="text-xl font-semibold text-gray-800">Privilèges enseignant</h2>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                                <div className="text-center">
                                                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-green-600" />
                                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Accès privilégié</h3>
                                                    <p className="text-green-700 text-sm leading-relaxed">
                                                        En tant qu'enseignant, vous bénéficiez d'un accès étendu aux ressources,
                                                        de privilèges de gestion et d'outils pédagogiques avancés.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sécurité */}
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <Shield className="h-6 w-6 mr-3" style={{ color: primaryColor }} />
                                            <h2 className="text-xl font-semibold text-gray-800">Sécurité</h2>
                                        </div>

                                        <div className="space-y-4">
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
                                                        {showPassword ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
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
                                                        {showConfirmPassword ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
                                                    </button>
                                                }
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="my-8 border-t border-gray-200"></div>

                            {/* Boutons d'action */}
                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                    leftIcon={<GraduationCap className="h-5 w-5" />}
                                    className="py-4 text-lg font-semibold cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    {loading ? 'Création en cours...' : 'Créer mon compte'}
                                </Button>

                                <div className="text-center">
                                    <span className="text-gray-500 text-sm">Vous avez déjà un compte ?</span>
                                    <button
                                        type="button"
                                        onClick={onSwitchToLogin}
                                        className="ml-2 font-medium cursor-pointer hover:underline transition-colors"
                                        style={{ color: primaryColor }}
                                    >
                                        Se connecter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
