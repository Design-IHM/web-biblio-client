import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export type ProfileTabType = 'personal' | 'security' | 'notifications' | 'preferences';

interface TabItem {
    id: ProfileTabType;
    label: string;
    icon: React.ReactNode;
    description?: string;
}

interface ProfileTabsProps {
    activeTab: ProfileTabType;
    onTabChange: (tab: ProfileTabType) => void;
    tabs: TabItem[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
                                                     activeTab,
                                                     onTabChange,
                                                     tabs
                                                 }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    // const secondaryColor = '#1b263b';

    const darkenColor = (color: string, percent: number = 20) => {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const primaryColorDark = darkenColor(primaryColor);

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-2">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`group flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all duration-300 rounded-xl relative overflow-hidden cursor-pointer ${
                                isActive
                                    ? 'text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                            style={{
                                background: isActive
                                    ? `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`
                                    : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                                    e.currentTarget.style.color = primaryColor;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#4b5563';
                                }
                            }}
                        >
                            {/* Effet de brillance pour l'onglet actif */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                            )}

                            {/* Icône */}
                            <div className="flex-shrink-0 relative z-10">
                                {tab.icon}
                            </div>

                            {/* Contenu */}
                            <div className="flex flex-col items-start min-w-0 relative z-10">
                <span className="font-semibold whitespace-nowrap">
                  {tab.label}
                </span>
                                {tab.description && (
                                    <span className={`text-xs mt-0.5 whitespace-nowrap ${
                                        isActive ? 'text-white/80' : 'text-gray-500'
                                    }`}>
                    {tab.description}
                  </span>
                                )}
                            </div>

                            {/* Indicateur actif */}
                            {isActive && (
                                <div
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileTabs;
