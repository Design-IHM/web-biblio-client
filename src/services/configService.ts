import { doc, getDoc } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { OrgSettings, AppSettings } from '../types/config';

class ConfigService {
    private orgSettingsCache: OrgSettings | null = null;
    private appSettingsCache: AppSettings | null = null;
    private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
    private lastFetch: number = 0;

    async getOrgSettings(): Promise<OrgSettings> {
        const now = Date.now();

        // Vérifier le cache
        if (this.orgSettingsCache && (now - this.lastFetch) < this.cacheExpiry) {
            return this.orgSettingsCache;
        }

        try {
            const orgSettingsRef = doc(db, 'Configuration', 'OrgSettings');
            const docSnap = await getDoc(orgSettingsRef);

            if (docSnap.exists()) {
                this.orgSettingsCache = docSnap.data() as OrgSettings;
                this.lastFetch = now;
                return this.orgSettingsCache;
            } else {
                // Paramètres par défaut
                return this.getDefaultOrgSettings();
            }
        } catch (error) {
            console.error('Error fetching organization settings:', error);
            return this.getDefaultOrgSettings();
        }
    }

    async getAppSettings(): Promise<AppSettings> {
        try {
            const appSettingsRef = doc(db, 'Configuration', 'AppSettings');
            const docSnap = await getDoc(appSettingsRef);

            if (docSnap.exists()) {
                this.appSettingsCache = docSnap.data() as AppSettings;
                return this.appSettingsCache;
            } else {
                return this.getDefaultAppSettings();
            }
        } catch (error) {
            console.error('Error fetching app settings:', error);
            return this.getDefaultAppSettings();
        }
    }

    // Méthode pour invalider le cache
    invalidateCache(): void {
        this.orgSettingsCache = null;
        this.appSettingsCache = null;
        this.lastFetch = 0;
    }

    private getDefaultOrgSettings(): OrgSettings {
        return {
            Address: "BP 8390, Melen, Yaoundé",
            Contact: {
                Email: "bornbeforedesign@gmail.com",
                Phone: "+237 677 77 77 77",
                WhatsApp: "+237 677 77 77 77",
                Facebook: "",
                Instagram: ""
            },
            LateReturnPenalties: ["100 FCFA par jour de retard"],
            Logo: "",
            MaximumSimultaneousLoans: 3,
            Name: "BiblioENSPY",
            OpeningHours: {
                Monday: '{"open": "08:00", "close": "18:00"}',
                Tuesday: '{"open": "08:00", "close": "18:00"}',
                Wednesday: '{"open": "08:00", "close": "18:00"}',
                Thursday: '{"open": "08:00", "close": "18:00"}',
                Friday: '{"open": "08:00", "close": "18:00"}',
                Saturday: '{"open": "10:00", "close": "16:00"}',
                Sunday: '{"open": "closed", "close": "closed"}'
            },
            SpecificBorrowingRules: ["Maximum 3 livres par étudiant"],
            Theme: {
                Primary: "#ff8c00",
                Secondary: "#1b263b"
            }
        };
    }

    private getDefaultAppSettings(): AppSettings {
        return {
            AppVersion: 1,
            DefaultLoanDuration: 21,
            GlobalLimits: 5,
            MaintenanceMode: false
        };
    }

    // Utilitaire pour parser les horaires
    parseOpeningHours(dayString: string): { open: string; close: string } {
        try {
            return JSON.parse(dayString);
        } catch {
            return { open: "closed", close: "closed" };
        }
    }

    // Utilitaire pour formater les horaires
    formatOpeningHours(dayString: string): string {
        const hours = this.parseOpeningHours(dayString);
        if (hours.open === "closed") {
            return "Fermé";
        }
        return `${hours.open} - ${hours.close}`;
    }
}

export const configService = new ConfigService();
