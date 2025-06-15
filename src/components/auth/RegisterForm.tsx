import React, { useState, useCallback, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useConfig } from '../../contexts/ConfigContext';
import { authService } from '../../services/auth/authService';
import {
    RegisterFormData,
    FormErrors,
    UserStatus,
    ACADEMIC_LEVELS
} from '../../types/auth';

import Input from '../ui/Input';
import Select from '../ui/Select';
import {
    User,
    Mail,
    Lock,
    Phone,
    GraduationCap,
    Building,
    BookOpen,
    UserCheck,
    Eye,
    EyeOff,
    AtSign
} from 'lucide-react';
import AvatarUploader from "../common/AvatarUploader.tsx";

interface RegisterFormProps {
    onSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

// Interface pour les départements de la base de données
interface Department {
    id: string;
    nom: string;
    image?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
    const { orgSettings } = useConfig();

    // Configuration des couleurs
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
        profilePicture: undefined,
        username: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    // États pour les départements
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentsLoading, setDepartmentsLoading] = useState(true);

    // Charger les départements depuis la base de données
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Departements'));
                const departmentsList: Department[] = [];

                querySnapshot.forEach((doc) => {
                    departmentsList.push({
                        id: doc.id,
                        ...doc.data()
                    } as Department);
                });

                // Trier par nom
                departmentsList.sort((a, b) => a.nom.localeCompare(b.nom));
                setDepartments(departmentsList);
            } catch (error) {
                console.error('Erreur lors du chargement des départements:', error);
            } finally {
                setDepartmentsLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // Validation du formulaire
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validation du nom
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom complet est requis';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        // Validation du nom d'utilisateur
        if (!formData.username?.trim()) {
            newErrors.username = 'Le nom d\'utilisateur est requis';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
            newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'L\'adresse email est requise';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Validation du mot de passe
        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        // Validation de la confirmation du mot de passe
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Validation du matricule
        if (formData.matricule && formData.matricule.trim().length < 6) {
            newErrors.matricule = 'Le matricule doit contenir au moins 6 caractères';
        }

        // Validation du téléphone
        const phoneRegex = /^(?:(?:\+|00)237)?[6][5-9]\d{7}$/;
        if (!formData.tel.trim()) {
            newErrors.tel = 'Le numéro de téléphone est requis';
        } else if (!phoneRegex.test(formData.tel.trim()) || formData.tel.trim().length < 8) {
            newErrors.tel = 'Numéro de téléphone invalide';
        }

        // Validation spécifique aux étudiants
        if (formData.statut === 'etudiant') {
            if (!formData.departement) {
                newErrors.departement = 'Le département est requis pour les étudiants';
            }
            if (!formData.niveau) {
                newErrors.niveau = 'Le niveau d\'études est requis pour les étudiants';
            }
        }

        // Validation spécifique aux enseignants
        if (formData.statut === 'enseignant') {
            if (!formData.departement) {
                newErrors.departement = 'Le département est requis pour les enseignants';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Gestion des changements d'input
    const handleInputChange = (field: keyof RegisterFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Générer automatiquement le nom d'utilisateur à partir du nom
        if (field === 'name' && value.trim()) {
            const username = value.toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[^a-z0-9]/g, '')
                .substring(0, 15);
            setFormData(prev => ({ ...prev, username }));
        }

        // Nettoyer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
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
    const handleStatusSwitch = (status: UserStatus) => {
        setFormData(prev => ({ ...prev, statut: status }));
        if (status === 'enseignant') {
            // Réinitialiser le niveau et le matricule pour les enseignants
            setFormData(prev => ({ ...prev, niveau: '', matricule: '' }));
            setErrors(prev => ({ ...prev, niveau: '', matricule: '' }));
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
            // Trouver le nom du département sélectionné
            const selectedDepartment = departments.find(dept => dept.id === formData.departement);
            const departmentName = selectedDepartment ? selectedDepartment.nom : formData.departement;

            // Préparer les données avec le nom du département
            const formDataWithDepartmentName = {
                ...formData,
                departement: departmentName
            };

            const response = await authService.signUp(formDataWithDepartmentName);

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

    // Créer les options pour le select des départements
    const departmentOptions = [
        { value: '', label: 'Sélectionnez votre département' },
        ...departments.map(dept => ({
            value: dept.id,
            label: dept.nom
        }))
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 px-4 flex items-center justify-center">
            <div className="w-full max-w-6xl">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div
                            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <BookOpen className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ color: secondaryColor }}
                    >
                        Rejoindre {organizationName}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Créez votre compte pour accéder à notre bibliothèque numérique
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                        {/* Erreur générale */}
                        {errors.general && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                                <p className="text-red-700">{errors.general}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Colonne 1: Informations personnelles */}
                            <div className="space-y-6">
                                <div>
                                    <h3
                                        className="text-xl font-semibold mb-4 flex items-center"
                                        style={{ color: secondaryColor }}
                                    >
                                        <User className="w-5 h-5 mr-2" />
                                        Informations personnelles
                                    </h3>

                                    {/* Avatar */}
                                    <div className="mb-6">
                                        <AvatarUploader
                                            currentAvatar={avatarUrl}
                                            onAvatarUploaded={handleAvatarUploaded}
                                            onAvatarRemoved={handleAvatarRemoved}
                                            size="xl"
                                            userName={formData.name}
                                            userId="temp-user"
                                        />
                                    </div>

                                    {/* Nom complet */}
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

                                    {/* Nom d'utilisateur */}
                                    <Input
                                        label="Nom d'utilisateur"
                                        type="text"
                                        placeholder="nomutilisateur"
                                        value={formData.username || ''}
                                        onChange={handleInputChange('username')}
                                        error={errors.username}
                                        leftIcon={<AtSign className="h-5 w-5" />}
                                        required
                                        helperText="Utilisé pour vous identifier de manière unique"
                                    />

                                    {/* Email */}
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

                                    {/* Téléphone */}
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

                            {/* Colonne 2: Informations académiques */}
                            <div className="space-y-6">
                                <div>
                                    <h3
                                        className="text-xl font-semibold mb-4 flex items-center"
                                        style={{ color: secondaryColor }}
                                    >
                                        <GraduationCap className="w-5 h-5 mr-2" />
                                        Informations académiques
                                    </h3>

                                    {/* Statut */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Statut <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusSwitch('etudiant')}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                    formData.statut === 'etudiant'
                                                        ? 'border-opacity-100 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                style={{
                                                    borderColor: formData.statut === 'etudiant' ? primaryColor : undefined,
                                                    backgroundColor: formData.statut === 'etudiant' ? `${primaryColor}10` : undefined
                                                }}
                                            >
                                                <GraduationCap
                                                    className="w-8 h-8 mx-auto mb-2"
                                                    style={{
                                                        color: formData.statut === 'etudiant' ? primaryColor : '#6B7280'
                                                    }}
                                                />
                                                <div className="text-sm font-medium">Étudiant</div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleStatusSwitch('enseignant')}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                    formData.statut === 'enseignant'
                                                        ? 'border-opacity-100 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                style={{
                                                    borderColor: formData.statut === 'enseignant' ? primaryColor : undefined,
                                                    backgroundColor: formData.statut === 'enseignant' ? `${primaryColor}10` : undefined
                                                }}
                                            >
                                                <UserCheck
                                                    className="w-8 h-8 mx-auto mb-2"
                                                    style={{
                                                        color: formData.statut === 'enseignant' ? primaryColor : '#6B7280'
                                                    }}
                                                />
                                                <div className="text-sm font-medium">Enseignant</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Matricule (uniquement pour les étudiants) */}
                                    <Input
                                        label="Matricule"
                                        type="text"
                                        placeholder={
                                            formData.statut === 'enseignant'
                                                ? "Non applicable pour les enseignants"
                                                : "Votre matricule (optionnel)"
                                        }
                                        value={formData.statut === 'enseignant' ? '' : (formData.matricule || '')}
                                        onChange={handleInputChange('matricule')}
                                        error={errors.matricule}
                                        leftIcon={<Building className="h-5 w-5" />}
                                        disabled={formData.statut === 'enseignant'}
                                        helperText={
                                            formData.statut === 'enseignant'
                                                ? "Le matricule n'est pas requis pour les enseignants"
                                                : "Laissez vide si vous n'en avez pas"
                                        }
                                    />

                                    {/* Département */}
                                    <div>
                                        {departmentsLoading ? (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Département <span className="text-red-500">*</span>
                                                </label>
                                                <div className="animate-pulse">
                                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Select
                                                label="Département"
                                                value={formData.departement || ''}
                                                onChange={handleInputChange('departement')}
                                                error={errors.departement}
                                                required
                                                options={departmentOptions}
                                            />
                                        )}
                                    </div>

                                    {/* Niveau (uniquement pour les étudiants) */}
                                    {formData.statut === 'etudiant' && (
                                        <Select
                                            label="Niveau d'études"
                                            value={formData.niveau || ''}
                                            onChange={handleInputChange('niveau')}
                                            error={errors.niveau}
                                            required
                                            options={[
                                                { value: '', label: 'Sélectionnez votre niveau' },
                                                ...ACADEMIC_LEVELS.map(level => ({
                                                    value: level.id,
                                                    label: `${level.name} (${level.code})`
                                                }))
                                            ]}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Colonne 3: Sécurité */}
                            <div className="space-y-6">
                                <div>
                                    <h3
                                        className="text-xl font-semibold mb-4 flex items-center"
                                        style={{ color: secondaryColor }}
                                    >
                                        <Lock className="w-5 h-5 mr-2" />
                                        Sécurité du compte
                                    </h3>

                                    {/* Mot de passe */}
                                    <Input
                                        label="Mot de passe"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimum 6 caractères"
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        error={errors.password}
                                        leftIcon={<Lock className="h-5 w-5" />}
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        }
                                        required
                                    />

                                    {/* Confirmation mot de passe */}
                                    <Input
                                        label="Confirmer le mot de passe"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Répétez votre mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange('confirmPassword')}
                                        error={errors.confirmPassword}
                                        leftIcon={<Lock className="h-5 w-5" />}
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        }
                                        required
                                    />

                                    {/* Informations de sécurité */}
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            Conseils de sécurité
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Utilisez un mot de passe unique</li>
                                            <li>• Mélangez lettres, chiffres et symboles</li>
                                            <li>• Ne partagez jamais vos identifiants</li>
                                            <li>• Vérifiez toujours l'URL du site</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                <p className="text-sm text-gray-600">
                                    Déjà un compte ?{' '}
                                    <button
                                        type="button"
                                        onClick={onSwitchToLogin}
                                        className="font-medium transition-colors hover:underline"
                                        style={{ color: primaryColor }}
                                    >
                                        Se connecter
                                    </button>
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading || departmentsLoading}
                                    className="w-full sm:w-auto px-8 py-3 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Création en cours...</span>
                                        </div>
                                    ) : departmentsLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Chargement...</span>
                                        </div>
                                    ) : (
                                        'Créer mon compte'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Note de confidentialité */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                        Vos données sont protégées et ne seront jamais partagées avec des tiers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
