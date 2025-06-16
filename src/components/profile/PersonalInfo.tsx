import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { BiblioUser } from '../../types/auth';
import { useConfig } from '../../contexts/ConfigContext';
import { Edit, Save, X, User, Mail, Phone, GraduationCap, Building } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface Department {
    id: string;
    nom: string;
    image?: string;
}

interface PersonalInfoProps {
    user: BiblioUser;
    onSave?: (updatedData: Partial<BiblioUser>) => Promise<void>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onSave }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setSaving] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentsLoading, setDepartmentsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        tel: user.tel || '',
        matricule: user.matricule || '',
        departement: user.departement || '',
        niveau: user.niveau || ''
    });

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

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSave = async () => {
        if (!onSave) return;

        setSaving(true);
        try {
            await onSave(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            tel: user.tel || '',
            matricule: user.matricule || '',
            departement: user.departement || '',
            niveau: user.niveau || ''
        });
        setIsEditing(false);
    };

    // Créer les options pour le select des départements
    const departmentOptions = [
        { value: '', label: 'Sélectionner un département' },
        ...departments.map(dept => ({
            value: dept.nom,
            label: dept.nom
        }))
    ];

    const levelOptions = [
        { value: '', label: 'Sélectionner un niveau' },
        { value: 'licence1', label: 'Licence 1' },
        { value: 'licence2', label: 'Licence 2' },
        { value: 'licence3', label: 'Licence 3' },
        { value: 'master1', label: 'Master 1' },
        { value: 'master2', label: 'Master 2' },
        { value: 'doctorat', label: 'Doctorat' }
    ];

    return (
        <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-1" style={{ color: secondaryColor }}>
                        Informations Personnelles
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Gérez vos informations personnelles et vos préférences de compte
                    </p>
                </div>

                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        className="cursor-pointer"
                    >
                        Modifier
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            size="sm"
                            leftIcon={<Save size={16} />}
                            loading={loading}
                            className="cursor-pointer"
                        >
                            Sauvegarder
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            leftIcon={<X size={16} />}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Annuler
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <div>
                    {isEditing ? (
                        <Input
                            label="Nom complet"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            leftIcon={<User size={18} />}
                            placeholder="Votre nom complet"
                            required
                        />
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <User size={16} style={{ color: primaryColor }} />
                                <span>Nom complet</span>
                            </label>
                            <p className="text-gray-900 font-medium">{user.name || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>

                {/* Email */}
                <div>
                    {isEditing ? (
                        <Input
                            label="Adresse email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            leftIcon={<Mail size={18} />}
                            placeholder="votre@email.com"
                            required
                        />
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Mail size={16} style={{ color: primaryColor }} />
                                <span>Adresse email</span>
                            </label>
                            <p className="text-gray-900 font-medium">{user.email || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>

                {/* Téléphone */}
                <div>
                    {isEditing ? (
                        <Input
                            label="Numéro de téléphone"
                            type="tel"
                            value={formData.tel}
                            onChange={handleInputChange('tel')}
                            leftIcon={<Phone size={18} />}
                            placeholder="+237 XXX XXX XXX"
                        />
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Phone size={16} style={{ color: primaryColor }} />
                                <span>Téléphone</span>
                            </label>
                            <p className="text-gray-900 font-medium">{user.tel || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>

                {/* Matricule */}
                <div>
                    {isEditing ? (
                        <Input
                            label="Matricule"
                            value={formData.matricule}
                            onChange={handleInputChange('matricule')}
                            leftIcon={<GraduationCap size={18} />}
                            placeholder="Votre matricule"
                        />
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <GraduationCap size={16} style={{ color: primaryColor }} />
                                <span>Matricule</span>
                            </label>
                            <p className="text-gray-900 font-medium">{user.matricule || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>

                {/* Département */}
                <div>
                    {isEditing ? (
                        <Select
                            label="Département"
                            value={formData.departement}
                            onChange={handleInputChange('departement')}
                            options={departmentOptions}
                            placeholder="Sélectionner un département"
                            disabled={departmentsLoading}
                        />
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Building size={16} style={{ color: primaryColor }} />
                                <span>Département</span>
                            </label>
                            <p className="text-gray-900 font-medium">{user.departement || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>

                {/* Niveau d'étude */}
                {user.statut === 'etudiant' && (
                    <div>
                        {isEditing ? (
                            <Select
                                label="Niveau d'étude"
                                value={formData.niveau}
                                onChange={handleInputChange('niveau')}
                                options={levelOptions}
                                placeholder="Sélectionner un niveau"
                            />
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <GraduationCap size={16} style={{ color: primaryColor }} />
                                    <span>Niveau d'étude</span>
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {user.niveau ? user.niveau.charAt(0).toUpperCase() + user.niveau.slice(1) : 'Non renseigné'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Informations sur le compte */}
            {!isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: secondaryColor }}>
                        Informations du compte
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Date d'inscription</label>
                            <p className="text-gray-900">
                                {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Non disponible'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Dernière connexion</label>
                            <p className="text-gray-900">
                                {user.lastLoginAt ? new Date(user.lastLoginAt.toDate()).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Non disponible'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default PersonalInfo;
