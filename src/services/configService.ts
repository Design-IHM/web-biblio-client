import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { OrgSettings, AppSettings } from '../types/config';

class ConfigService {
    private orgSettingsCache: OrgSettings | null = null;
    private appSettingsCache: AppSettings | null = null;
    private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
    private lastFetch: number = 0;

    async getOrgSettings(): Promise<OrgSettings> {
        const now = Date.now();

        // Vérifier le cache seulement si on a des données récentes
        if (this.orgSettingsCache && (now - this.lastFetch) < this.cacheExpiry) {
            console.log('📦 Using cached org settings');
            return this.orgSettingsCache;
        }

        try {
            console.log('🔍 Fetching org settings from Firebase...');

            // Vérifier d'abord si la collection Configuration existe
            const configCollection = collection(db, 'Configuration');
            const configSnapshot = await getDocs(configCollection);

            if (configSnapshot.empty) {
                console.warn('⚠️ Configuration collection is empty or doesn\'t exist');
                return this.getDefaultOrgSettings();
            }

            const orgSettingsRef = doc(db, 'Configuration', 'OrgSettings');
            const docSnap = await getDoc(orgSettingsRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as OrgSettings;
                console.log('✅ Org settings loaded from Firebase:', data);

                // Vérifier que les données essentielles sont présentes
                if (!data.Name || !data.Theme) {
                    console.warn('⚠️ Incomplete org settings, using defaults');
                    return this.getDefaultOrgSettings();
                }

                this.orgSettingsCache = data;
                this.lastFetch = now;

                // Appliquer le thème immédiatement
                this.applyThemeToDOM(data.Theme);

                return this.orgSettingsCache;
            } else {
                console.warn('⚠️ OrgSettings document does not exist');
                return this.getDefaultOrgSettings();
            }
        } catch (error) {
            console.error('❌ Error fetching organization settings:', error);

            // Vérifier si c'est un problème de permissions
            if (error instanceof Error && error.message.includes('permission')) {
                console.error('🔒 Firebase permissions error. Check Firestore rules.');
            }

            return this.getDefaultOrgSettings();
        }
    }

    async getAppSettings(): Promise<AppSettings> {
        try {
            console.log('🔍 Fetching app settings from Firebase...');

            const appSettingsRef = doc(db, 'Configuration', 'AppSettings');
            const docSnap = await getDoc(appSettingsRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as AppSettings;
                console.log('✅ App settings loaded from Firebase:', data);
                this.appSettingsCache = data;
                return this.appSettingsCache;
            } else {
                console.warn('⚠️ AppSettings document does not exist');
                return this.getDefaultAppSettings();
            }
        } catch (error) {
            console.error('❌ Error fetching app settings:', error);
            return this.getDefaultAppSettings();
        }
    }

    // Méthode pour invalider le cache et forcer le rechargement
    invalidateCache(): void {
        console.log('🗑️ Invalidating cache...');
        this.orgSettingsCache = null;
        this.appSettingsCache = null;
        this.lastFetch = 0;
    }

    // Force le rechargement depuis Firebase
    async forceRefresh(): Promise<void> {
        this.invalidateCache();
        await this.getOrgSettings();
        await this.getAppSettings();
    }

    // Méthode pour tester la connexion Firebase
    async testFirebaseConnection(): Promise<boolean> {
        try {
            console.log('🧪 Testing Firebase connection...');
            const testRef = doc(db, 'Configuration', 'test');
            await getDoc(testRef);
            console.log('✅ Firebase connection successful');
            return true;
        } catch (error) {
            console.error('❌ Firebase connection failed:', error);
            return false;
        }
    }

    private getDefaultOrgSettings(): OrgSettings {
        console.log('📝 Using default org settings');
        const defaults = {
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

        // Appliquer le thème par défaut
        this.applyThemeToDOM(defaults.Theme);
        return defaults;
    }

    private getDefaultAppSettings(): AppSettings {
        return {
            AppVersion: 1,
            DefaultLoanDuration: 21,
            GlobalLimits: 5,
            MaintenanceMode: false
        };
    }

    // Appliquer le thème au DOM
    private applyThemeToDOM(theme: { Primary: string; Secondary: string }): void {
        try {
            console.log('🎨 Applying theme to DOM:', theme);

            const root = document.documentElement;

            // Appliquer les couleurs principales
            root.style.setProperty('--color-primary', theme.Primary);
            root.style.setProperty('--color-secondary', theme.Secondary);
            root.style.setProperty('--tw-color-primary', theme.Primary);
            root.style.setProperty('--tw-color-secondary', theme.Secondary);

            // Convertir en RGB pour les variations d'opacité
            const primaryRgb = this.hexToRgb(theme.Primary);
            const secondaryRgb = this.hexToRgb(theme.Secondary);

            if (primaryRgb) {
                root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
            }

            if (secondaryRgb) {
                root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
            }

            console.log('✅ Theme applied successfully');
        } catch (error) {
            console.error('❌ Error applying theme:', error);
        }
    }

    // Utilitaire pour convertir hex en RGB
    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
