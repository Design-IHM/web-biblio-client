// src/services/notificationService.ts
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    writeBatch,
    doc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../configs/firebase';

// Type pour une notification
export interface Notification {
    id: string;
    userId: string;
    type: 'success' | 'reminder' | 'alert' | 'info';
    title: string;
    message: string;
    read: boolean;
    timestamp: Timestamp;
    link?: string;
}

class NotificationService {
    /**
     * Ajoute une nouvelle notification pour un utilisateur.
     */
    async addNotification(data: Omit<Notification, 'id' | 'read' | 'timestamp'>): Promise<void> {
        try {
            const notificationCollection = collection(db, 'Notifications');
            await addDoc(notificationCollection, {
                ...data,
                read: false,
                timestamp: Timestamp.now()
            });
            console.log(`✅ Notification créée pour l'utilisateur ${data.userId}`);
        } catch (error) {
            console.error("❌ Erreur lors de la création de la notification:", error);
        }
    }

    /**
     * Récupère les notifications pour un utilisateur donné.
     */
    async getNotificationsForUser(userId: string, count: number = 50): Promise<Notification[]> {
        try {
            const q = query(
                collection(db, 'Notifications'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(count)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des notifications:", error);
            return [];
        }
    }

    /**
     * Marque une notification spécifique comme lue.
     */
    async markAsRead(notificationId: string): Promise<void> {
        try {
            const notifRef = doc(db, 'Notifications', notificationId);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour de la notification:", error);
        }
    }

    /**
     * Marque toutes les notifications non lues d'un utilisateur comme lues.
     */
    async markAllAsRead(userId: string): Promise<void> {
        try {
            const q = query(
                collection(db, 'Notifications'),
                where('userId', '==', userId),
                where('read', '==', false)
            );
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) return;

            const batch = writeBatch(db);
            querySnapshot.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour de toutes les notifications:", error);
        }
    }
    
    /**
     * Récupère le nombre de notifications non lues.
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const q = query(
                collection(db, 'Notifications'),
                where('userId', '==', userId),
                where('read', '==', false)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error) {
            console.error("❌ Erreur lors du comptage des notifications non lues:", error);
            return 0;
        }
    }
}

export const notificationService = new NotificationService();