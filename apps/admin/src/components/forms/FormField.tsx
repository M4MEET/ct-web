'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  children: React.ReactNode;
  error?: FieldError;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ 
  children, 
  error, 
  label, 
  description, 
  required = false,
  className = ''
}: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-500 text-xs">{error.message}</p>
        </div>
      )}
      
      {!error && description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  isValidating?: boolean;
  isValid?: boolean;
  validationError?: string;
}

export function TextInput({ 
  error, 
  isValidating = false, 
  isValid = false, 
  validationError,
  className = '', 
  ...props 
}: TextInputProps) {
  const hasError = error || validationError;
  
  return (
    <div className="relative">
      <input
        className={`
          w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : isValidating
            ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
          }
          ${className}
        `}
        {...props}
      />
      
      {/* Status Icons */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        {isValidating && (
          <svg className="animate-spin h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        )}
        
        {!isValidating && !hasError && isValid && props.value && (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        
        {hasError && (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      </div>
      
      {/* Validation Status Text */}
      {isValidating && (
        <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1">
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Checking availability...
        </p>
      )}
      
      {validationError && (
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-500 text-xs">{validationError}</p>
        </div>
      )}
    </div>
  );
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError;
  options: Array<{ value: string; label: string; icon?: string }>;
}

export function SelectInput({ error, options, className = '', ...props }: SelectInputProps) {
  return (
    <select
      className={`
        w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
        }
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.icon && `${option.icon} `}{option.label}
        </option>
      ))}
    </select>
  );
}

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

export function TextareaInput({ error, className = '', ...props }: TextareaInputProps) {
  return (
    <textarea
      className={`
        w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
        }
        ${className}
      `}
      {...props}
    />
  );
}

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function SubmitButton({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  variant = 'primary',
  size = 'md',
  children, 
  className = '', 
  ...props 
}: SubmitButtonProps) {
  const baseClasses = 'font-medium rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const variantClasses = {
    primary: 'text-white bg-primary-500 hover:bg-primary-600 focus:ring-primary-200 disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
    danger: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-200 disabled:bg-gray-300 disabled:text-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isLoading || props.disabled ? 'cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ type, message, onClose, className = '' }: AlertProps) {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  };

  const style = styles[type];

  return (
    <div className={`border rounded-lg p-4 ${style.container} ${className}`}>
      <div className="flex items-center gap-2">
        <svg className={`h-5 w-5 ${style.icon} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
        </svg>
        <span className="text-sm font-medium flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.icon.replace('400', '600')} hover:${style.icon.replace('400', '800')} transition-colors`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}