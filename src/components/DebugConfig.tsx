import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { configService } from '../services/configService';

const DebugConfig: React.FC = () => {
    const { orgSettings, isLoading, error, refetch, testConnection } = useConfig();
    const [connectionStatus, setConnectionStatus] = useState<string>('Non testé');
    const [firebaseConfig, setFirebaseConfig] = useState<Record<string, string> | null>(null);

    const handleTestConnection = async () => {
        setConnectionStatus('Test en cours...');
        const isConnected = await testConnection();
        setConnectionStatus(isConnected ? '✅ Connecté' : '❌ Échec');
    };

    const handleForceRefresh = async () => {
        await configService.forceRefresh();
        await refetch();
    };

    const checkFirebaseConfig = () => {
        const config = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };
        setFirebaseConfig(config);
    };

    // N'afficher qu'en développement
    if (import.meta.env.PROD) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            border: '2px solid #ff8c00',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            fontSize: '12px',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#1b263b' }}>🔧 Debug Config</h3>

            <div style={{ marginBottom: '8px' }}>
                <strong>Status:</strong> {isLoading ? '⏳ Chargement...' : '✅ Chargé'}
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: '8px' }}>
                    <strong>Erreur:</strong> {error}
                </div>
            )}

            <div style={{ marginBottom: '8px' }}>
                <strong>Nom org:</strong> {orgSettings?.Name || 'Non défini'}
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>Thème:</strong> {orgSettings?.Theme?.Primary || 'Non défini'}
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>Connexion:</strong> {connectionStatus}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                    onClick={handleTestConnection}
                    style={{
                        background: '#ff8c00',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                >
                    Test Connexion
                </button>

                <button
                    onClick={handleForceRefresh}
                    style={{
                        background: '#1b263b',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                >
                    Force Refresh
                </button>

                <button
                    onClick={checkFirebaseConfig}
                    style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                >
                    Check Config
                </button>
            </div>

            {firebaseConfig && (
                <div style={{ marginTop: '12px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Firebase Config:</strong>
                    <pre style={{ fontSize: '10px', margin: '4px 0' }}>
                        {JSON.stringify(firebaseConfig, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default DebugConfig;
