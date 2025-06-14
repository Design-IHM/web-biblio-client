import { doc, updateDoc } from "firebase/firestore";
import { db } from "../configs/firebase";
import {BiblioUser, EtatValue, ReservationEtatValue} from "../types/auth";

interface CancelParams {
    name: string;
    collection: string;
    id: string;
}

/**
 * Annule une réservation :
 * - met l'état à "ras"
 * - vide le tabEtat correspondant
 * - met à jour l'objet reservations s'il existe
 */
export const cancelReservation = async (
    currentUser: BiblioUser,
    { name, id }: CancelParams
) => {
    const userRef = doc(db, "BiblioUser", currentUser.email);

    const updates: Partial<Record<keyof BiblioUser, unknown>> = {};
    let found = false;

    for (let i = 1; i <= 5; i++) {
        const etatKey = `etat${i}` as keyof BiblioUser;
        const tabEtatKey = `tabEtat${i}` as keyof BiblioUser;

        const tabEtat = currentUser[tabEtatKey];

        if (
            currentUser[etatKey] === "reserv" as EtatValue &&
            Array.isArray(tabEtat) &&
            tabEtat[0] === id &&
            tabEtat[1] === name
        ) {
            updates[etatKey] = "ras" as ReservationEtatValue;
            updates[tabEtatKey] = null;
            found = true;
            break;
        }
    }

    // Met à jour la réservation dans le tableau de réservations si présent
    const updatedReservations = currentUser.reservations?.map((r) =>
        r.name === name ? { ...r, etat: "annuler" as ReservationEtatValue } : r
    );

    if (updatedReservations) {
        updates["reservations"] = updatedReservations;
    }

    if (!found && !updatedReservations) {
        console.warn("Aucune réservation à annuler trouvée.");
        return;
    }

    await updateDoc(userRef, updates);
};
