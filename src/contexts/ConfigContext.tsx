import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { configService } from '../services/configService';
import { OrgSettings, AppSettings } from '../types/config';

interface ConfigContextType {
    orgSettings: OrgSettings | null;
    appSettings: AppSettings | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [orgSettings, setOrgSettings] = useState<OrgSettings | null>(null);
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [orgData, appData] = await Promise.all([
                configService.getOrgSettings(),
                configService.getAppSettings()
            ]);

            setOrgSettings(orgData);
            setAppSettings(appData);

            // Appliquer le thème dynamiquement
            if (orgData.Theme) {
                applyTheme(orgData.Theme);
            }
        } catch (err) {
            setError('Erreur lors du chargement de la configuration');
            console.error('Config fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const applyTheme = (theme: { Primary: string; Secondary: string }) => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.Primary);
        root.style.setProperty('--color-secondary', theme.Secondary);

        // Mise à jour des variables CSS pour Tailwind
        const style = document.createElement('style');
        style.textContent = `
      :root {
        --tw-color-primary: ${theme.Primary};
        --tw-color-secondary: ${theme.Secondary};
      }
    `;
        document.head.appendChild(style);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const refetch = async () => {
        configService.invalidateCache();
        await fetchSettings();
    };

    return (
        <ConfigContext.Provider value={{
            orgSettings,
            appSettings,
            isLoading,
            error,
            refetch
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
