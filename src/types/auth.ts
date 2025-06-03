import { Timestamp } from 'firebase/firestore';

export type UserStatus = 'etudiant' | 'enseignant';
export type UserLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
export type EtatValue = 'ras' | 'emprunt' | 'retard' | 'suspendu';

export interface Department {
    id: string;
    name: string;
    code: string;
}

export interface AcademicLevel {
    id: string;
    name: string;
    code: string;
}

export interface BiblioUser {
    id?: string;
    name: string;
    matricule: string;
    email: string;
    niveau: string;
    departement: string;
    tel: string;
    createdAt: Timestamp;
    lastLoginAt: Timestamp;
    level: UserLevel;
    tabEtat1: string[];
    tabEtat2: string[];
    tabEtat3: string[];
    tabEtat4?: string[];
    tabEtat5?: string[];
    etat1: EtatValue;
    etat2: EtatValue;
    etat3: EtatValue;
    etat4?: EtatValue;
    etat5?: EtatValue;
    emailVerified: boolean;
    profilePicture?: string;
    statut: UserStatus;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    matricule: string;
    tel: string;
    statut: UserStatus;
    departement?: string;
    niveau?: string;
    profilePicture?: string | File; // Accepte string (URL) ou File
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthContextType {
    user: BiblioUser | null;
    loading: boolean;
    signIn: (data: LoginFormData) => Promise<void>;
    signUp: (data: RegisterFormData) => Promise<void>;
    signOut: () => Promise<void>;
    sendEmailVerification: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (data: Partial<BiblioUser>) => Promise<void>;
}

export interface FormErrors {
    [key: string]: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: BiblioUser;
}

export interface EmailVerificationProps {
    email: string;
    onResendEmail: () => Promise<void>;
    onBackToLogin: () => void;
}

export interface PasswordResetProps {
    email: string;
    onBackToLogin: () => void;
}

// Constantes pour les niveaux académiques
export const ACADEMIC_LEVELS: AcademicLevel[] = [
    { id: 'licence1', name: 'Licence 1', code: 'L1' },
    { id: 'licence2', name: 'Licence 2', code: 'L2' },
    { id: 'licence3', name: 'Licence 3', code: 'L3' },
    { id: 'master1', name: 'Master 1', code: 'M1' },
    { id: 'master2', name: 'Master 2', code: 'M2' },
    { id: 'doctorat', name: 'Doctorat', code: 'DOC' }
];

// Constantes pour les départements
export const DEPARTMENTS: Department[] = [
    { id: 'informatique', name: 'Informatique', code: 'INFO' },
    { id: 'mathematiques', name: 'Mathématiques', code: 'MATH' },
    { id: 'physique', name: 'Physique', code: 'PHYS' },
    { id: 'chimie', name: 'Chimie', code: 'CHIM' },
    { id: 'biologie', name: 'Biologie', code: 'BIO' },
    { id: 'genie_civil', name: 'Génie Civil', code: 'GC' },
    { id: 'genie_electrique', name: 'Génie Électrique', code: 'GE' },
    { id: 'genie_mecanique', name: 'Génie Mécanique', code: 'GM' }
];
