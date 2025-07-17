/**
 * Reusable LoadingSpinner Component
 * Provides consistent loading states across the application
 */

import { LoadingSpinnerProps } from '@/types';

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClass = spinnerSizes[size];
  
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClass} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function InlineLoader({ message = 'Loading...', size = 'md' }: { message?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}