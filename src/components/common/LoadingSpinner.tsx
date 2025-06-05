import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
    color?: string;
    showLogo?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'md',
                                                           text,
                                                           fullScreen = false,
                                                           color, // Si fourni, override les couleurs du thème
                                                           showLogo = true
                                                       }) => {
    const { orgSettings, isLoading: configLoading } = useConfig();

    // Utiliser la couleur personnalisée ou celle du thème
    const primaryColor = color || orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    const sizeClasses = {
        sm: {
            spinner: 'w-4 h-4',
            inner: 'w-2 h-2',
            logo: 'h-8 w-8',
            text: 'text-sm'
        },
        md: {
            spinner: 'w-8 h-8',
            inner: 'w-4 h-4',
            logo: 'h-10 w-10',
            text: 'text-sm'
        },
        lg: {
            spinner: 'w-12 h-12',
            inner: 'w-6 h-6',
            logo: 'h-12 w-12',
            text: 'text-base'
        },
        xl: {
            spinner: 'w-16 h-16',
            inner: 'w-8 h-8',
            logo: 'h-16 w-16',
            text: 'text-lg'
        }
    };

    const sizeConfig = sizeClasses[size];

    const spinnerContent = (
        <div className="flex flex-col items-center space-y-4">
            {/* Logo de l'organisation si disponible et si showLogo est true */}
            {showLogo && orgSettings?.Logo && size !== 'sm' && !configLoading && (
                <div className="relative">
                    <img
                        src={orgSettings.Logo}
                        alt={organizationName}
                        className={`${sizeConfig.logo} object-contain animate-pulse`}
                    />
                    {/* Cercle de bordure animé autour du logo */}
                    <div
                        className={`absolute inset-0 ${sizeConfig.logo} rounded-full border-2 border-transparent animate-spin`}
                        style={{
                            borderTopColor: primaryColor,
                            borderRightColor: `${primaryColor}40`,
                            animationDuration: '2s'
                        }}
                    ></div>
                </div>
            )}

            {/* Spinner principal */}
            <div className="relative">
                {/* Cercle extérieur */}
                <div
                    className={`${sizeConfig.spinner} rounded-full border-4 animate-spin`}
                    style={{
                        borderColor: `${primaryColor}20`,
                        borderTopColor: primaryColor,
                        borderRightColor: primaryColor
                    }}
                ></div>

                {/* Cercle intérieur pour un effet plus moderne */}
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeConfig.inner} rounded-full animate-pulse`}
                    style={{
                        backgroundColor: primaryColor,
                        animationDuration: '1.5s'
                    }}
                ></div>

                {/* Effet de pulsation secondaire */}
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeConfig.spinner} rounded-full border-2 border-transparent animate-ping`}
                    style={{
                        borderColor: `${primaryColor}30`,
                        animationDuration: '2s'
                    }}
                ></div>
            </div>

            {/* Texte de chargement */}
            {text && size !== 'sm' && (
                <div className="text-center max-w-xs">
                    <p
                        className={`${sizeConfig.text} font-medium animate-pulse`}
                        style={{ color: secondaryColor }}
                    >
                        {text}
                    </p>

                    {/* Points animés */}
                    <div className="flex justify-center space-x-1 mt-2">
                        <div
                            className="w-1 h-1 rounded-full animate-bounce"
                            style={{
                                backgroundColor: primaryColor,
                                animationDelay: '0ms'
                            }}
                        ></div>
                        <div
                            className="w-1 h-1 rounded-full animate-bounce"
                            style={{
                                backgroundColor: primaryColor,
                                animationDelay: '150ms'
                            }}
                        ></div>
                        <div
                            className="w-1 h-1 rounded-full animate-bounce"
                            style={{
                                backgroundColor: primaryColor,
                                animationDelay: '300ms'
                            }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Nom de l'organisation pour les grands spinners */}
            {size === 'xl' && !configLoading && organizationName && (
                <div className="text-center">
                    <p
                        className="text-sm font-semibold tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        {organizationName}
                    </p>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                    {spinnerContent}

                    {/* Arrière-plan décoratif pour le mode plein écran */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Cercles décoratifs */}
                        <div
                            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-5 animate-pulse"
                            style={{
                                backgroundColor: primaryColor,
                                animationDuration: '3s'
                            }}
                        ></div>
                        <div
                            className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-5 animate-pulse"
                            style={{
                                backgroundColor: secondaryColor,
                                animationDuration: '4s',
                                animationDelay: '1s'
                            }}
                        ></div>
                        <div
                            className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full opacity-5 animate-pulse"
                            style={{
                                backgroundColor: primaryColor,
                                animationDuration: '2.5s',
                                animationDelay: '2s'
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            {spinnerContent}
        </div>
    );
};

export default LoadingSpinner;
