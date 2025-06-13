// src/services/historyService.ts
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs,
    Timestamp 
} from 'firebase/firestore';
import { db } from '../configs/firebase';

// Type pour un événement d'historique
export interface HistoryEvent {
    id?: string;
    userId: string;
    type: 'book_view' | 'thesis_view';
    itemId: string;
    itemTitle: string;
    itemCoverUrl?: string;
    timestamp: Timestamp;
}

class HistoryService {

    /**
     * Ajoute un nouvel événement à l'historique de l'utilisateur.
     * Pour éviter de surcharger l'historique, on pourrait ajouter une logique
     * pour ne pas enregistrer la même vue si elle a eu lieu il y a moins de 5 minutes.
     */
    async addHistoryEvent(eventData: Omit<HistoryEvent, 'id' | 'timestamp'>): Promise<void> {
        try {
            const historyCollection = collection(db, 'UserHistory');
            await addDoc(historyCollection, {
                ...eventData,
                timestamp: Timestamp.now()
            });
            console.log('✅ Événement d\'historique ajouté:', eventData.type, eventData.itemTitle);
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout à l'historique:", error);
        }
    }

    /**
     * Récupère l'historique de consultation d'un utilisateur.
     */
    async getUserHistory(userId: string, count: number = 50): Promise<HistoryEvent[]> {
        try {
            const historyCollection = collection(db, 'UserHistory');
            const q = query(
                historyCollection, 
                where('userId', '==', userId), 
                orderBy('timestamp', 'desc'), 
                limit(count)
            );

            const querySnapshot = await getDocs(q);
            
            const history: HistoryEvent[] = [];
            querySnapshot.forEach(doc => {
                history.push({ id: doc.id, ...doc.data() } as HistoryEvent);
            });

            return history;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération de l'historique:", error);
            return [];
        }
    }
}

export const historyService = new HistoryService();