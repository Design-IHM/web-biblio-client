// src/components/ui/Badge.tsx
import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
                                         children,
                                         variant = 'default',
                                         size = 'md',
                                         className = ''
                                     }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = '#1b263b';

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2'
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}30`
                };
            case 'secondary':
                return {
                    backgroundColor: `${secondaryColor}15`,
                    color: secondaryColor,
                    border: `1px solid ${secondaryColor}30`
                };
            case 'success':
                return {
                    backgroundColor: '#10b98115',
                    color: '#10b981',
                    border: '1px solid #10b98130'
                };
            case 'warning':
                return {
                    backgroundColor: '#f59e0b15',
                    color: '#f59e0b',
                    border: '1px solid #f59e0b30'
                };
            case 'error':
                return {
                    backgroundColor: '#ef444415',
                    color: '#ef4444',
                    border: '1px solid #ef444430'
                };
            case 'info':
                return {
                    backgroundColor: '#3b82f615',
                    color: '#3b82f6',
                    border: '1px solid #3b82f630'
                };
            default:
                return {
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db'
                };
        }
    };

    const badgeClasses = `inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 ${sizeClasses[size]} ${className}`;

    return (
        <span
            className={badgeClasses}
            style={getVariantStyles()}
        >
      {children}
    </span>
    );
};

export default Badge;
