import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendEmailVerification as firebaseSendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    getDocs,
    collection
} from 'firebase/firestore';

import { auth, db } from '../../configs/firebase';
import { configService } from '../configService';
import { cloudinaryService } from '../cloudinaryService';
import {
    BiblioUser,
    RegisterFormData,
    LoginFormData,
    AuthResponse,
    EtatValue,
    TabEtatEntry,
    DocRecentItem,
    HistoriqueItem,
    MessageItem,
    NotificationItem,
    ReservationItem
} from '../../types/auth';

class AuthService {

    /**
     * Inscription d'un nouvel utilisateur
     */
    async signUp(data: RegisterFormData): Promise<AuthResponse> {
        try {
            // Récupérer la configuration pour MaximumSimultaneousLoans
            const orgSettings = await configService.getOrgSettings();
            const maxLoans = orgSettings.MaximumSimultaneousLoans || 3;

            // Créer l'utilisateur Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const firebaseUser = userCredential.user;

            // Upload de l'image de profil si fournie (via Cloudinary)
            let profilePictureUrl = '';
            if (data.profilePicture) {
                if (typeof data.profilePicture === 'string') {
                    profilePictureUrl = data.profilePicture;
                } else {
                    const uploadResponse = await cloudinaryService.uploadAvatar(
                        data.profilePicture,
                        firebaseUser.uid
                    );

                    if (uploadResponse.success && uploadResponse.url) {
                        profilePictureUrl = uploadResponse.url;
                    } else {
                        console.warn('⚠️ Échec upload avatar:', uploadResponse.error);
                    }
                }
            }

            // États dynamiques pour etat1..etatN et tabEtat1..tabEtatN
            const userStateData = this.createUserStateData(maxLoans);

            const defaultEtatData = {
                etat1: 'ras' as EtatValue,
                etat2: 'ras' as EtatValue,
                etat3: 'ras' as EtatValue,
                tabEtat1: Array(6).fill('ras') as TabEtatEntry,
                tabEtat2: Array(6).fill('ras') as TabEtatEntry,
                tabEtat3: Array(6).fill('ras') as TabEtatEntry
            };

            // S'assurer que niveau et departement ne sont jamais undefined
            const niveau = data.statut === 'etudiant' ? (data.niveau || '') : '';
            const departement = data.departement || '';

            // Création finale de l'objet utilisateur
            const biblioUser: Omit<BiblioUser, 'id'> = {
                name: data.name,
                matricule: data.matricule || '',
                email: data.email,
                username: data.username || data.name.toLowerCase().replace(/\s+/g, ''),
                niveau,
                departement,
                tel: data.tel,
                statut: data.statut,
                level: 'level1',
                createdAt: Timestamp.now(),
                lastLoginAt: Timestamp.now(),
                emailVerified: false,
                profilePicture: profilePictureUrl,
                imageUri: profilePictureUrl,
                inscritArchi: '',

                // Données utilisateur
                docRecent: [] as DocRecentItem[],
                historique: [] as HistoriqueItem[],
                messages: [] as MessageItem[],
                notifications: [] as NotificationItem[],
                reservations: [] as ReservationItem[],
                searchHistory: [] as string[],

                ...defaultEtatData,
                ...userStateData
            };

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'BiblioUser', firebaseUser.email!), biblioUser);

            // Mise à jour du profil Firebase Auth
            await updateProfile(firebaseUser, {
                displayName: data.name,
                photoURL: profilePictureUrl || null
            });

            // Envoi d'email de vérification
            await firebaseSendEmailVerification(firebaseUser);

            return {
                success: true,
                message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
                user: { ...biblioUser, id: firebaseUser.uid }
            };

        } catch (error: unknown) {
            console.error('❌ Erreur inscription:', error);

            if (error instanceof Error) {
                console.error('Message:', error.message);
                console.error('Stack:', error.stack);
            }

            return {
                success: false,
                message: this.getErrorMessage(error as string)
            };
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    async signIn(data: LoginFormData): Promise<AuthResponse> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const firebaseUser = userCredential.user;

            // Récupérer les données utilisateur depuis Firestore
            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.email!));

            if (!userDoc.exists()) {
                console.error('❌ Utilisateur non trouvé dans Firestore');
                throw new Error('Utilisateur non trouvé dans la base de données');
            }

            const biblioUser = userDoc.data() as BiblioUser;

            // Mettre à jour la dernière connexion
            await updateDoc(doc(db, 'BiblioUser', firebaseUser.email!), {
                lastLoginAt: Timestamp.now()
            });

            return {
                success: true,
                message: 'Connexion réussie !',
                user: { ...biblioUser, id: firebaseUser.uid }
            };

        } catch (error: unknown) {
            return {
                success: false,
                message: this.getErrorMessage(error as string)
            };
        }
    }

    /**
     * Déconnexion
     */
    async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('❌ Erreur déconnexion:', error);
            throw error;
        }
    }

    /**
     * Envoi d'email de vérification
     */
    async sendEmailVerification(): Promise<void> {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Aucun utilisateur connecté');
            }

            await firebaseSendEmailVerification(user);
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            throw error;
        }
    }

    /**
     * Réinitialisation du mot de passe
     */
    async resetPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('❌ Erreur reset password:', error);
            throw error;
        }
    }

    /**
     * Récupération des données utilisateur
     */
    async getCurrentUser(): Promise<BiblioUser | null> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) return null;

            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.email!));

            if (!userDoc.exists()) return null;

            const userData = userDoc.data() as BiblioUser;

            return { ...userData, id: firebaseUser.uid };
        } catch (error) {
            console.error('❌ Erreur récupération utilisateur:', error);
            return null;
        }
    }

    /**
     * Mise à jour du profil utilisateur
     */
    async updateUserProfile(data: Partial<BiblioUser>): Promise<void> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            if (!firebaseUser.email) {
                throw new Error('Email utilisateur non disponible');
            }

            // Validation des données
            if (data.name !== undefined && data.name.trim().length < 2) {
                throw new Error('Le nom doit contenir au moins 2 caractères');
            }

            if (data.email !== undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    throw new Error('Format d\'email invalide');
                }
            }

            if (data.tel !== undefined && data.tel.length > 0) {
                const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
                if (!phoneRegex.test(data.tel)) {
                    throw new Error('Format de téléphone invalide');
                }
            }

            // S'assurer que niveau et departement ne sont jamais undefined
            const updateData = { ...data };
            if (updateData.niveau === undefined) updateData.niveau = '';
            if (updateData.departement === undefined) updateData.departement = '';

            // Mettre à jour dans Firestore
            await updateDoc(doc(db, 'BiblioUser', firebaseUser.email), updateData);

            // Mettre à jour le profil Firebase Auth si nécessaire
            const authUpdateData: { displayName?: string; photoURL?: string } = {};
            if (data.name) authUpdateData.displayName = data.name;
            if (data.profilePicture) authUpdateData.photoURL = data.profilePicture;

            if (Object.keys(authUpdateData).length > 0) {
                await updateProfile(firebaseUser, authUpdateData);
            }

            console.log('✅ Profil utilisateur mis à jour avec succès');
        } catch (error: unknown) {
            console.error('❌ Erreur mise à jour profil:', error);

            // Vérifie que l'erreur est un objet avec une propriété "code" (Firebase ou custom)
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                typeof (error as { code: unknown }).code === 'string'
            ) {
                const code = (error as { code: string }).code;

                switch (code) {
                    case 'auth/requires-recent-login':
                        throw new Error('Cette opération nécessite une connexion récente. Veuillez vous reconnecter et réessayer');
                    case 'auth/user-not-found':
                        throw new Error('Utilisateur introuvable');
                    case 'auth/user-disabled':
                        throw new Error('Ce compte utilisateur a été désactivé');
                    case 'auth/network-request-failed':
                        throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet');
                    case 'permission-denied':
                        throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier ces informations');
                    case 'not-found':
                        throw new Error('Document utilisateur introuvable dans la base de données');
                    default:
                        { const message = (error as { message?: string }).message;
                        throw new Error(message || 'Erreur lors de la mise à jour du profil'); }
                }
            }
            throw error;
        }

    }

    /**
     * Changement de mot de passe
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            if (!firebaseUser.email) {
                throw new Error('Email utilisateur non disponible');
            }

            // Validation des paramètres
            if (!currentPassword || currentPassword.trim().length === 0) {
                throw new Error('Le mot de passe actuel est requis');
            }

            if (!newPassword || newPassword.trim().length < 6) {
                throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
            }

            if (currentPassword === newPassword) {
                throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
            }

            // Créer les credentials pour la ré-authentification
            const credential = EmailAuthProvider.credential(
                firebaseUser.email,
                currentPassword
            );

            // Ré-authentifier l'utilisateur avec son mot de passe actuel
            await reauthenticateWithCredential(firebaseUser, credential);

            // Mettre à jour le mot de passe
            await updatePassword(firebaseUser, newPassword);

            console.log('✅ Mot de passe mis à jour avec succès');

            // Optionnel : Mettre à jour la dernière modification dans Firestore
            try {
                await updateDoc(doc(db, 'BiblioUser', firebaseUser.email), {
                    lastPasswordChange: Timestamp.now()
                });
            } catch (firestoreError) {
                console.warn('⚠️ Impossible de mettre à jour la date de changement de mot de passe:', firestoreError);
            }

        } catch (error: unknown) {
            console.error('❌ Erreur mise à jour profil:', error);

            // Vérifie que l'erreur est un objet avec une propriété "code" (Firebase ou custom)
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                typeof (error as { code: unknown }).code === 'string'
            ) {
                const code = (error as { code: string }).code;

                switch (code) {
                    case 'auth/requires-recent-login':
                        throw new Error('Cette opération nécessite une connexion récente. Veuillez vous reconnecter et réessayer');
                    case 'auth/user-not-found':
                        throw new Error('Utilisateur introuvable');
                    case 'auth/user-disabled':
                        throw new Error('Ce compte utilisateur a été désactivé');
                    case 'auth/network-request-failed':
                        throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet');
                    case 'permission-denied':
                        throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier ces informations');
                    case 'not-found':
                        throw new Error('Document utilisateur introuvable dans la base de données');
                    default:
                        // Si message est présent
                        { const message = (error as { message?: string }).message;
                        throw new Error(message || 'Erreur lors de la mise à jour du profil'); }
                }
            }
            throw error;
        }

    }

    /**
     * Suppression du compte utilisateur
     */
    async deleteAccount(currentPassword: string): Promise<void> {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                throw new Error('Aucun utilisateur connecté');
            }

            if (!firebaseUser.email) {
                throw new Error('Email utilisateur non disponible');
            }

            // Validation du mot de passe
            if (!currentPassword || currentPassword.trim().length === 0) {
                throw new Error('Le mot de passe est requis pour supprimer le compte');
            }

            // Récupérer les données utilisateur avant suppression (pour vérifications)
            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.email));
            const userData = userDoc.exists() ? userDoc.data() as BiblioUser : null;

            // Vérifier s'il y a des emprunts actifs
            if (userData?.reservations && userData.reservations.length > 0) {
                const activeReservations = userData.reservations.filter(r =>
                    r.etat === 'reserver'
                );
                if (activeReservations.length > 0) {
                    throw new Error('Impossible de supprimer le compte. Vous avez des emprunts ou réservations en cours. Veuillez d\'abord les retourner ou les annuler.');
                }
            }

            // Créer les credentials pour la ré-authentification
            const credential = EmailAuthProvider.credential(
                firebaseUser.email,
                currentPassword
            );

            // Ré-authentifier l'utilisateur avant la suppression
            await reauthenticateWithCredential(firebaseUser, credential);

            // Supprimer le document utilisateur de Firestore
            await deleteDoc(doc(db, 'BiblioUser', firebaseUser.email));

            // Enfin, supprimer le compte Firebase Auth
            await deleteUser(firebaseUser);

            console.log('✅ Compte utilisateur supprimé avec succès');

        } catch (error: unknown) {
            console.error('❌ Erreur mise à jour profil:', error);

            // Vérifie que l'erreur est un objet avec une propriété "code" (Firebase ou custom)
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                typeof (error as { code: unknown }).code === 'string'
            ) {
                const code = (error as { code: string }).code;

                switch (code) {
                    case 'auth/requires-recent-login':
                        throw new Error('Cette opération nécessite une connexion récente. Veuillez vous reconnecter et réessayer');
                    case 'auth/user-not-found':
                        throw new Error('Utilisateur introuvable');
                    case 'auth/user-disabled':
                        throw new Error('Ce compte utilisateur a été désactivé');
                    case 'auth/network-request-failed':
                        throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet');
                    case 'permission-denied':
                        throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier ces informations');
                    case 'not-found':
                        throw new Error('Document utilisateur introuvable dans la base de données');
                    default:
                        // Si message est présent
                        { const message = (error as { message?: string }).message;
                        throw new Error(message || 'Erreur lors de la mise à jour du profil'); }
                }
            }

            // Si l'erreur n'a pas de code, la relancer telle quelle
            throw error;
        }
    }

    /**
     * Alias pour updateProfile (pour compatibilité avec vos composants)
     */
    async updateProfile(data: Partial<BiblioUser>): Promise<void> {
        return this.updateUserProfile(data);
    }

    /**
     * Mise à jour de l'historique des documents
     */
    async updateDocHistory(email: string, docItem: HistoriqueItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', email));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedHistory = [docItem, ...userData.historique].slice(0, 50);

            await updateDoc(doc(db, 'BiblioUser', email), {
                historique: updatedHistory
            });
        } catch (error) {
            console.error('❌ Erreur mise à jour historique:', error);
        }
    }

    /**
     * Ajouter un document récent
     */
    async addRecentDoc(email: string, docItem: DocRecentItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', email));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedRecent = [docItem, ...userData.docRecent].slice(0, 20);

            await updateDoc(doc(db, 'BiblioUser', email), {
                docRecent: updatedRecent
            });
        } catch (error) {
            console.error('❌ Erreur ajout document récent:', error);
        }
    }

    /**
     * Ajouter une notification
     */
    async addNotification(email: string, notification: NotificationItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', email));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedNotifications = [notification, ...userData.notifications];

            await updateDoc(doc(db, 'BiblioUser', email), {
                notifications: updatedNotifications
            });
        } catch (error) {
            console.error('❌ Erreur ajout notification:', error);
        }
    }

    /**
     * Mettre à jour l'état d'un emprunt
     */
    async updateEtatEmprunt(email: string, etatIndex: number, nouvelEtat: EtatValue, tabEtat?: TabEtatEntry): Promise<void> {
        try {
            // Validation de l'index
            if (etatIndex < 1 || etatIndex > 5) {
                throw new Error(`Index d'emprunt invalide: ${etatIndex}. Doit être entre 1 et 5.`);
            }

            // Validation de l'état
            const validEtats: EtatValue[] = ['ras', 'emprunt', 'retard'];
            if (!validEtats.includes(nouvelEtat)) {
                throw new Error(`État invalide: ${nouvelEtat}. Doit être: ${validEtats.join(', ')}`);
            }

            // Construction typée des données de mise à jour
            const updateData: Record<string, EtatValue | TabEtatEntry> = {
                [`etat${etatIndex}`]: nouvelEtat
            };

            if (tabEtat) {
                // Validation optionnelle de TabEtatEntry
                if (!Array.isArray(tabEtat) || tabEtat.length !== 7) {
                    throw new Error('TabEtatEntry doit être un tableau de 7 éléments');
                }
                updateData[`tabEtat${etatIndex}`] = tabEtat;
            }

            await updateDoc(doc(db, 'BiblioUser', email), updateData);
            console.log(`✅ État emprunt ${etatIndex} mis à jour: ${nouvelEtat}`);

        } catch (error) {
            console.error('❌ Erreur mise à jour état emprunt:', error);
            throw error;
        }
    }

    /**
     * Création des données d'état utilisateur dynamiques
     */
    private createUserStateData(maxLoans: number): Record<string, EtatValue | TabEtatEntry> {
        const stateData: Record<string, EtatValue | TabEtatEntry> = {};

        for (let i = 1; i <= maxLoans; i++) {
            stateData[`etat${i}`] = 'ras';
            stateData[`tabEtat${i}`] = Array(7).fill('ras') as TabEtatEntry;
        }

        return stateData;
    }

    /**
     * Conversion des codes d'erreur Firebase en messages lisibles
     */
    private getErrorMessage(errorCode: string): string {
        const errorMessages: Record<string, string> = {
            'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
            'auth/invalid-email': 'Adresse email invalide.',
            'auth/operation-not-allowed': 'Opération non autorisée.',
            'auth/weak-password': 'Le mot de passe est trop faible.',
            'auth/user-disabled': 'Ce compte a été désactivé.',
            'auth/user-not-found': 'Aucun utilisateur trouvé avec cette adresse email.',
            'auth/wrong-password': 'Mot de passe incorrect.',
            'auth/invalid-credential': 'Identifiants invalides.',
            'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
            'auth/network-request-failed': 'Erreur de connexion réseau.',
            'auth/requires-recent-login': 'Cette opération nécessite une connexion récente.'
        };

        return errorMessages[errorCode] || 'Une erreur inattendue s\'est produite.';
    }

    /**
     * Vérification de la validité du matricule
     */
    async validateMatricule(matricule: string): Promise<boolean> {
        try {
            return matricule.length >= 6;
        } catch (error) {
            console.error('❌ Erreur validation matricule:', error);
            return false;
        }
    }

    /**
     * Vérification de la disponibilité de l'email
     */
    async checkEmailAvailability(email: string): Promise<boolean> {
        try {
            const querySnapshot = await getDocs(collection(db, 'BiblioUser'));
            const emailExists = querySnapshot.docs.some((doc) => doc.data().email === email);
            return !emailExists;
        } catch (error) {
            console.error('❌ Erreur vérification email:', error);
            return false;
        }
    }
}

export const authService = new AuthService();
