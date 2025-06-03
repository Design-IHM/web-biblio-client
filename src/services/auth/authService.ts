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
import {BiblioUser, RegisterFormData, LoginFormData, AuthResponse, EtatValue} from '../../types/auth';

class AuthService {

    /**
     * Inscription d'un nouvel utilisateur
     */
    async signUp(data: RegisterFormData): Promise<AuthResponse> {
        try {
            console.log('🚀 Début inscription:', {
                email: data.email,
                statut: data.statut,
                niveau: data.niveau,
                departement: data.departement
            });

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
            console.log('✅ Utilisateur Firebase créé:', firebaseUser.uid);

            // Upload de l'image de profil si fournie (via Cloudinary)
            let profilePictureUrl = '';
            if (data.profilePicture) {
                console.log('📸 Upload de l\'avatar en cours...');

                // Convertir l'URL en File si nécessaire
                let fileToUpload: File;
                if (typeof data.profilePicture === 'string') {
                    // Si c'est déjà une URL Cloudinary, on la garde
                    profilePictureUrl = data.profilePicture;
                } else {
                    // Si c'est un File, on l'upload
                    fileToUpload = data.profilePicture;
                    const uploadResponse = await cloudinaryService.uploadAvatar(
                        fileToUpload,
                        firebaseUser.uid
                    );

                    if (uploadResponse.success && uploadResponse.url) {
                        profilePictureUrl = uploadResponse.url;
                        console.log('✅ Avatar uploadé:', profilePictureUrl);
                    } else {
                        console.warn('⚠️ Échec upload avatar:', uploadResponse.error);
                    }
                }
            }

            // Créer les tableaux d'état dynamiquement selon MaximumSimultaneousLoans
            const userStateData = this.createUserStateData(maxLoans);
            console.log('📋 États utilisateur créés:', userStateData);

            // CORRECTION: S'assurer que niveau et departement ne sont jamais undefined
            const niveau = data.statut === 'etudiant' ? (data.niveau || '') : '';
            const departement = data.statut === 'etudiant' ? (data.departement || '') : '';

            console.log('🎓 Données académiques:', {
                statut: data.statut,
                niveau,
                departement
            });

            // Créer le document utilisateur dans Firestore
            const biblioUser: BiblioUser = {
                id: firebaseUser.uid,
                name: data.name,
                matricule: data.matricule,
                email: data.email,
                niveau: niveau,
                departement: departement,
                tel: data.tel,
                createdAt: Timestamp.now(),
                lastLoginAt: Timestamp.now(),
                level: 'level1',
                ...userStateData,
                emailVerified: false,
                profilePicture: profilePictureUrl,
                statut: data.statut
            };

            console.log('👤 Données utilisateur finales à sauvegarder:', {
                id: biblioUser.id,
                email: biblioUser.email,
                statut: biblioUser.statut,
                niveau: biblioUser.niveau,
                departement: biblioUser.departement,
                hasProfilePicture: !!biblioUser.profilePicture
            });

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'BiblioUser', firebaseUser.uid), biblioUser);
            console.log('✅ Utilisateur sauvegardé dans Firestore');

            // Vérification de la sauvegarde
            const savedDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.uid));
            if (savedDoc.exists()) {
                console.log('✅ Vérification: Document bien sauvegardé:', savedDoc.data());
            } else {
                console.error('❌ Vérification: Document non trouvé après sauvegarde');
            }

            // Mettre à jour le profil Firebase Auth
            await updateProfile(firebaseUser, {
                displayName: data.name,
                photoURL: profilePictureUrl
            });
            console.log('✅ Profil Firebase Auth mis à jour');

            // Envoyer l'email de vérification
            await firebaseSendEmailVerification(firebaseUser);
            console.log('✅ Email de vérification envoyé');

            return {
                success: true,
                message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
                user: biblioUser
            };

        } catch (error: unknown) {
            console.error('❌ Erreur inscription:', error);

            // Log détaillé de l'erreur
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
            console.log('🔐 Tentative de connexion:', data.email);

            const userCredential = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const firebaseUser = userCredential.user;
            console.log('✅ Utilisateur Firebase connecté:', firebaseUser.uid);

            // Récupérer les données utilisateur depuis Firestore
            const userDoc = await getDoc(doc(db, 'BiblioUser', firebaseUser.uid));

            if (!userDoc.exists()) {
                console.error('❌ Utilisateur non trouvé dans Firestore');
                throw new Error('Utilisateur non trouvé dans la base de données');
            }

            const biblioUser = userDoc.data() as BiblioUser;
            console.log('✅ Données utilisateur récupérées:', {
                email: biblioUser.email,
                statut: biblioUser.statut,
                niveau: biblioUser.niveau,
                departement: biblioUser.departement
            });

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
            console.error('❌ Erreur connexion:', error);
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
            console.log('✅ Déconnexion réussie');
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
            console.log('✅ Email de vérification envoyé');
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
            console.log('✅ Email de réinitialisation envoyé');
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
            console.log('📤 Données utilisateur récupérées:', {
                email: userData.email,
                statut: userData.statut,
                niveau: userData.niveau,
                departement: userData.departement
            });

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

            console.log('✅ Profil utilisateur mis à jour');
        } catch (error) {
            console.error('❌ Erreur mise à jour profil:', error);
            throw error;
        }
    }

    /**
     * Création des données d'état utilisateur dynamiques
     */
    private createUserStateData(maxLoans: number): Record<string, string | string[]> {
        const stateData: Record<string, EtatValue | string[]> = {};

        for (let i = 1; i <= maxLoans; i++) {
            stateData[`tabEtat${i}`] = [];
            stateData[`etat${i}`] = 'ras' as EtatValue;
        }

        console.log('📊 États créés pour', maxLoans, 'emprunts max:', stateData);
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
