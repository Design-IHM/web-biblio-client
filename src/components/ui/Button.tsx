import React, { forwardRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         children,
         variant = 'primary',
         size = 'md',
         loading = false,
         leftIcon,
         rightIcon,
         fullWidth = false,
         disabled,
         className = '',
         ...props
     }, ref) => {
        const { orgSettings } = useConfig();
        const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
        const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

        const sizeClasses = {
            sm: 'py-2 px-4 text-sm',
            md: 'py-3 px-6 text-base',
            lg: 'py-4 px-8 text-lg',
            xl: 'py-5 px-10 text-xl'
        };

        const getVariantClasses = () => {
            switch (variant) {
                case 'primary':
                    return 'text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
                case 'secondary':
                    return 'text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
                case 'outline':
                    return 'border-2 bg-transparent hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95';
                case 'ghost':
                    return 'bg-transparent hover:bg-opacity-10 transform hover:scale-105 active:scale-95';
                case 'danger':
                    return 'bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl transform hover:scale-105 active:scale-95';
                default:
                    return 'text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
            }
        };

        const getVariantStyles = () => {
            switch (variant) {
                case 'primary':
                    return {
                        backgroundColor: primaryColor,
                        '--hover-bg': `${primaryColor}dd`
                    };
                case 'secondary':
                    return {
                        backgroundColor: secondaryColor,
                        '--hover-bg': `${secondaryColor}dd`
                    };
                case 'outline':
                    return {
                        borderColor: primaryColor,
                        color: primaryColor,
                        '--hover-bg': primaryColor
                    };
                case 'ghost':
                    return {
                        color: primaryColor,
                        '--hover-bg': `${primaryColor}10`
                    };
                default:
                    return {
                        backgroundColor: primaryColor
                    };
            }
        };

        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
        const sizeClass = sizeClasses[size];
        const variantClasses = getVariantClasses();
        const widthClass = fullWidth ? 'w-full' : '';

        const buttonClasses = `${baseClasses} ${sizeClass} ${variantClasses} ${widthClass} ${className}`;
        const buttonStyles = {
            ...getVariantStyles(),
            '--focus-ring-color': `${primaryColor}30`
        } as unknown as React.CSSProperties;

        const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled && !loading) {
                const target = e.currentTarget;
                if (variant === 'primary') {
                    target.style.backgroundColor = `${primaryColor}dd`;
                } else if (variant === 'secondary') {
                    target.style.backgroundColor = `${secondaryColor}dd`;
                } else if (variant === 'outline') {
                    target.style.backgroundColor = primaryColor;
                    target.style.color = 'white';
                } else if (variant === 'ghost') {
                    target.style.backgroundColor = `${primaryColor}10`;
                }
            }
            props.onMouseEnter?.(e);
        };

        const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled && !loading) {
                const target = e.currentTarget;
                if (variant === 'primary') {
                    target.style.backgroundColor = primaryColor;
                } else if (variant === 'secondary') {
                    target.style.backgroundColor = secondaryColor;
                } else if (variant === 'outline') {
                    target.style.backgroundColor = 'transparent';
                    target.style.color = primaryColor;
                } else if (variant === 'ghost') {
                    target.style.backgroundColor = 'transparent';
                }
            }
            props.onMouseLeave?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
            e.target.style.boxShadow = `0 0 0 4px ${primaryColor}30`;
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
            e.target.style.boxShadow = 'none';
            props.onBlur?.(e);
        };

        return (
            <button
                ref={ref}
                className={buttonClasses}
                style={buttonStyles}
                disabled={disabled || loading}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {leftIcon && !loading && (
                    <span className="mr-2">{leftIcon}</span>
                )}

                {children}

                {rightIcon && !loading && (
                    <span className="ml-2">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
