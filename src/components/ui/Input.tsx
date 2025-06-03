import React, { forwardRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled' | 'outlined';
    inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
         label,
         error,
         helperText,
         leftIcon,
         rightIcon,
         variant = 'default',
         inputSize = 'md',
         className = '',
         id,
         ...props
     }, ref) => {
        const { orgSettings } = useConfig();
        const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
        const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        const sizeClasses = {
            sm: 'py-2 px-3 text-sm',
            md: 'py-3 px-4 text-base',
            lg: 'py-4 px-5 text-lg'
        };

        const variantClasses = {
            default: 'border border-gray-300 bg-white',
            filled: 'border-0 bg-gray-100',
            outlined: 'border-2 border-gray-300 bg-transparent'
        };

        const getInputClasses = () => {
            const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none';
            const sizeClass = sizeClasses[inputSize];
            const variantClass = variantClasses[variant];
            const errorClass = error ? 'border-red-500' : '';
            const iconLeftClass = leftIcon ? 'pl-12' : '';
            const iconRightClass = rightIcon ? 'pr-12' : '';

            return `${baseClasses} ${sizeClass} ${variantClass} ${errorClass} ${iconLeftClass} ${iconRightClass} ${className}`;
        };

        const focusStyle = {
            '--focus-color': primaryColor
        } as React.CSSProperties;

        return (
            <div className="relative">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={getInputClasses()}
                        style={{
                            ...focusStyle,
                            ...(props.style || {})
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = primaryColor;
                            e.target.style.boxShadow = `0 0 0 3px ${primaryColor}20`;
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
                            e.target.style.boxShadow = 'none';
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
