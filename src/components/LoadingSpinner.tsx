import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'md',
                                                           text,
                                                           fullScreen = false
                                                       }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const spinnerContent = (
        <div className="flex flex-col items-center space-y-4">
            {/* Logo de l'organisation si disponible */}
            {orgSettings?.Logo && size !== 'sm' && (
                <img
                    src={orgSettings.Logo}
                    alt={organizationName}
                    className="h-12 w-12 object-contain animate-pulse"
                />
            )}

            {/* Spinner */}
            <div className="relative">
                <div
                    className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 animate-spin`}
                    style={{
                        borderTopColor: primaryColor,
                        borderRightColor: primaryColor
                    }}
                ></div>

                {/* Cercle intérieur pour un effet plus moderne */}
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        size === 'sm' ? 'w-2 h-2' :
                            size === 'md' ? 'w-4 h-4' :
                                size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'
                    } rounded-full animate-pulse`}
                    style={{ backgroundColor: primaryColor }}
                ></div>
            </div>

            {/* Texte de chargement */}
            {text && size !== 'sm' && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
};

export default LoadingSpinner;
