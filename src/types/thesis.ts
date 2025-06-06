
import { Timestamp } from 'firebase/firestore';

export interface ThesisComment {
    heure: Timestamp;
    nomUser: string;
    note: number;
    texte: string;
}

export interface ThesisCommentWithUserData extends ThesisComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    helpful?: number;
}

export interface BiblioThesis {
    id: string;
    abstract: string;
    annee: number;
    commentaire: ThesisComment[];
    département: string;
    etagere: string;
    image: string;
    keywords: string;
    matricule: string;
    name: string;
    theme?: string;
    superviseur?: string;
    pdfUrl?: string;
}

export interface ThesisSearchFilters {
    query: string;
    author: string;
    department: string;
    year: string;
    keywords: string;
    supervisor: string;
}
