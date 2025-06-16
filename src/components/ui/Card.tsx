import React, { forwardRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    hover?: boolean;
    clickable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
         children,
         variant = 'default',
         padding = 'md',
         hover = false,
         clickable = false,
         className = '',
         ...props
     }, ref) => {
        const { orgSettings } = useConfig();
        const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

        const paddingClasses = {
            none: '',
            sm: 'p-3',
            md: 'p-4 md:p-6',
            lg: 'p-6 md:p-8',
            xl: 'p-8 md:p-10'
        };

        const variantClasses = {
            default: 'bg-white border border-gray-200 shadow-sm',
            elevated: 'bg-white shadow-lg border border-gray-100',
            outlined: 'bg-white border-2 border-gray-300',
            glass: 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg'
        };

        const getCardClasses = () => {
            const baseClasses = 'rounded-xl transition-all duration-300';
            const variantClass = variantClasses[variant];
            const paddingClass = paddingClasses[padding];
            const interactionClasses = [
                hover && 'hover:shadow-lg hover:-translate-y-1',
                clickable && 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
            ].filter(Boolean).join(' ');

            return `${baseClasses} ${variantClass} ${paddingClass} ${interactionClasses} ${className}`.trim();
        };

        const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
            if (hover || clickable) {
                e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${primaryColor}20`;
            }
            props.onMouseEnter?.(e);
        };

        const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
            if (hover || clickable) {
                e.currentTarget.style.boxShadow = '';
            }
            props.onMouseLeave?.(e);
        };

        return (
            <div
                ref={ref}
                className={getCardClasses()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
