/**
 * Reusable Button Component
 * Replaces scattered button implementations with a single, consistent component
 */

import { ButtonProps } from '@/types';
import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700',
  outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantStyles = buttonVariants[variant];
  const sizeStyles = buttonSizes[size];
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles}
        ${sizeStyles}
        ${className}
      `}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

// Specialized button components for common use cases
export function PrimaryButton(props: Omit<ButtonProps, 'variant'> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} variant="secondary" />;
}

export function DangerButton(props: Omit<ButtonProps, 'variant'> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} variant="danger" />;
}

export function SuccessButton(props: Omit<ButtonProps, 'variant'> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} variant="success" />;
}

export function OutlineButton(props: Omit<ButtonProps, 'variant'> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} variant="outline" />;
}