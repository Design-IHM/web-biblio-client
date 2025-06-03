import React, { forwardRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    variant?: 'default' | 'filled' | 'outlined';
    selectSize?: 'sm' | 'md' | 'lg';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
         label,
         error,
         helperText,
         options,
         placeholder,
         variant = 'default',
         selectSize = 'md',
         className = '',
         id,
         ...props
     }, ref) => {
        const { orgSettings } = useConfig();
        const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
        const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        const sizeClasses = {
            sm: 'py-2 px-3 pr-8 text-sm',
            md: 'py-3 px-4 pr-10 text-base',
            lg: 'py-4 px-5 pr-12 text-lg'
        };

        const variantClasses = {
            default: 'border border-gray-300 bg-white',
            filled: 'border-0 bg-gray-100',
            outlined: 'border-2 border-gray-300 bg-transparent'
        };

        const getSelectClasses = () => {
            const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none appearance-none cursor-pointer';
            const sizeClass = sizeClasses[selectSize];
            const variantClass = variantClasses[variant];
            const errorClass = error ? 'border-red-500' : '';

            return `${baseClasses} ${sizeClass} ${variantClass} ${errorClass} ${className}`;
        };

        const iconSize = {
            sm: 16,
            md: 20,
            lg: 24
        };

        const iconPosition = {
            sm: 'right-2',
            md: 'right-3',
            lg: 'right-4'
        };

        return (
            <div className="relative">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium mb-2"
                        style={{ color: secondaryColor }}
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={getSelectClasses()}
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
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Icône chevron personnalisée */}
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none ${iconPosition[selectSize]}`}
                        style={{ color: primaryColor }}
                    >
                        <ChevronDown size={iconSize[selectSize]} />
                    </div>
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

Select.displayName = 'Select';

export default Select;
