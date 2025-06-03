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
    Timestamp, getDocs, collection
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';

import { auth, db } from '../../configs/firebase';
import { configService } from '../configService';
import {BiblioUser, RegisterFormData, LoginFormData, AuthResponse, EtatValue} from '../../types/auth';

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

            // Upload de l'image de profil si fournie
            let profilePictureUrl = '';
            if (data.profilePicture) {
                profilePictureUrl = await this.uploadProfilePicture(
                    data.profilePicture,
                    firebaseUser.uid
                );
            }

            // Créer les tableaux d'état dynamiquement selon MaximumSimultaneousLoans
            const userStateData = this.createUserStateData(maxLoans);

            // Créer le document utilisateur dans Firestore
            const biblioUser: BiblioUser = {
                id: firebaseUser.uid,
                name: data.name,
                matricule: data.matricule,
                email: data.email,
                niveau: data.statut === 'etudiant' ? data.niveau : undefined,
                departement: data.statut === 'etudiant' ? data.departement : undefined,
                tel: data.tel,
                createdAt: Timestamp.now(),
                lastLoginAt: Timestamp.now(),
                level: 'level1',
                ...userStateData,
                emailVerified: false,
                profilePicture: profilePictureUrl,
                statut: data.statut
            };

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'BiblioUser', firebaseUser.uid), biblioUser);

            // Mettre à jour le profil Firebase Auth
            await updateProfile(firebaseUser, {
                displayName: data.name,
                photoURL: profilePictureUrl
            });

            // Envoyer l'email de vérification
            await firebaseSendEmailVerification(firebaseUser);

            return {
                success: true,
                message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
                user: biblioUser
            };

        } catch (error: unknown) {
            console.error('Erreur inscription:', error);
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
            console.error('Erreur connexion:', error);
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
            console.error('Erreur déconnexion:', error);
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
            console.error('Erreur envoi email:', error);
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
            console.error('Erreur reset password:', error);
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

            return { ...userDoc.data(), id: firebaseUser.uid } as BiblioUser;
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
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

            // Mettre à jour dans Firestore
            await updateDoc(doc(db, 'BiblioUser', firebaseUser.uid), data);

            // Mettre à jour le profil Firebase Auth si nécessaire
            const updateData: { displayName?: string; photoURL?: string } = {};
            if (data.name) updateData.displayName = data.name;
            if (data.profilePicture) updateData.photoURL = data.profilePicture;

            if (Object.keys(updateData).length > 0) {
                await updateProfile(firebaseUser, updateData);
            }
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            throw error;
        }
    }

    /**
     * Upload d'image de profil
     */
    private async uploadProfilePicture(file: File, userId: string): Promise<string> {
        try {
            const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Erreur upload image:', error);
            throw new Error('Échec de l\'upload de l\'image de profil');
        }
    }

    /**
     * Création des données d'état utilisateur dynamiques
     */
    private createUserStateData(maxLoans: number): Record<string, string | string[]> {
        const stateData: Record<string, EtatValue | string[]> = {};

        for (let i = 1; i <= maxLoans; i++) {
            stateData[`tabEtat${i}`] = [];
            stateData[`etat${i}`] = 'ras';
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
            // Cette méthode peut être étendue pour vérifier l'unicité du matricule
            // ou valider selon un format spécifique
            return matricule.length >= 6;
        } catch (error) {
            console.error('Erreur validation matricule:', error);
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
            if (emailExists) return false;
            return true;
        } catch (error) {
            console.error('Erreur vérification email:', error);
            return false;
        }
    }
}

export const authService = new AuthService();
