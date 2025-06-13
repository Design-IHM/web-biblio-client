import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendEmailVerification as firebaseSendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
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
            console.log('📊 Paramètres org:', { maxLoans });

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
                // Convertir l'URL en File si nécessaire
                let fileToUpload: File;
                if (typeof data.profilePicture === 'string') {
                    profilePictureUrl = data.profilePicture;
                } else {
                    fileToUpload = data.profilePicture;
                    const uploadResponse = await cloudinaryService.uploadAvatar(
                        fileToUpload,
                        firebaseUser.uid
                    );

                    if (uploadResponse.success && uploadResponse.url) {
                        profilePictureUrl = uploadResponse.url;
                    } else {
                        console.warn('⚠️ Échec upload avatar:', uploadResponse.error);
                    }
                }
            }

            // Créer les tableaux d'état dynamiquement selon MaximumSimultaneousLoans
            const userStateData = this.createUserStateData(maxLoans);

            // S'assurer que niveau et departement ne sont jamais undefined
            const niveau = data.statut === 'etudiant' ? (data.niveau || '') : '';
            const departement = data.departement || '';

            // Créer l'objet utilisateur complet avec les nouveaux champs
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
                inscritArchi: '', // Valeur par défaut

                // Nouveaux champs ajoutés
                docRecent: [] as DocRecentItem[],
                historique: [] as HistoriqueItem[],
                messages: [] as MessageItem[],
                notifications: [] as NotificationItem[],
                reservations: [] as ReservationItem[],
                searchHistory: [] as string[],

                // États dynamiques
                ...userStateData
            };

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'BiblioUser', firebaseUser.uid), biblioUser);

            // Mettre à jour le profil Firebase Auth
            await updateProfile(firebaseUser, {
                displayName: data.name,
                photoURL: profilePictureUrl || null
            });

            // Envoyer l'email de vérification
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
            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.uid));

            if (!userDoc.exists()) {
                console.error('❌ Utilisateur non trouvé dans Firestore');
                throw new Error('Utilisateur non trouvé dans la base de données');
            }

            const biblioUser = userDoc.data() as BiblioUser;

            // Mettre à jour la dernière connexion
            await updateDoc(doc(db, 'BiblioUser', firebaseUser.uid), {
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

            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.uid));

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

            // S'assurer que niveau et departement ne sont jamais undefined
            const updateData = { ...data };
            if (updateData.niveau === undefined) updateData.niveau = '';
            if (updateData.departement === undefined) updateData.departement = '';

            // Mettre à jour dans Firestore
            await updateDoc(doc(db, 'BiblioUser', firebaseUser.uid), updateData);

            // Mettre à jour le profil Firebase Auth si nécessaire
            const authUpdateData: { displayName?: string; photoURL?: string } = {};
            if (data.name) authUpdateData.displayName = data.name;
            if (data.profilePicture) authUpdateData.photoURL = data.profilePicture;

            if (Object.keys(authUpdateData).length > 0) {
                await updateProfile(firebaseUser, authUpdateData);
            }
        } catch (error) {
            console.error('❌ Erreur mise à jour profil:', error);
            throw error;
        }
    }

    /**
     * Mise à jour de l'historique des documents
     */
    async updateDocHistory(userId: string, docItem: HistoriqueItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', userId));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedHistory = [docItem, ...userData.historique].slice(0, 50);

            await updateDoc(doc(db, 'BiblioUser', userId), {
                historique: updatedHistory
            });
        } catch (error) {
            console.error('❌ Erreur mise à jour historique:', error);
        }
    }

    /**
     * Ajouter un document récent
     */
    async addRecentDoc(userId: string, docItem: DocRecentItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', userId));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedRecent = [docItem, ...userData.docRecent].slice(0, 20);

            await updateDoc(doc(db, 'BiblioUser', userId), {
                docRecent: updatedRecent
            });
        } catch (error) {
            console.error('❌ Erreur ajout document récent:', error);
        }
    }

    /**
     * Ajouter une notification
     */
    async addNotification(userId: string, notification: NotificationItem): Promise<void> {
        try {
            const userDoc = await getDoc(doc(db, 'BiblioUser', userId));
            if (!userDoc.exists()) return;

            const userData = userDoc.data() as BiblioUser;
            const updatedNotifications = [notification, ...userData.notifications];

            await updateDoc(doc(db, 'BiblioUser', userId), {
                notifications: updatedNotifications
            });
        } catch (error) {
            console.error('❌ Erreur ajout notification:', error);
        }
    }

    /**
     * Mettre à jour l'état d'un emprunt
     */
    async updateEtatEmprunt(userId: string, etatIndex: number, nouvelEtat: EtatValue, tabEtat?: TabEtatEntry): Promise<void> {
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

            await updateDoc(doc(db, 'BiblioUser', userId), updateData);
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
            stateData[`etat${i}`] = 'ras' as EtatValue;
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
