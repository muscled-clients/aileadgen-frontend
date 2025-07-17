/**
 * Reusable Badge Component
 * Replaces multiple badge implementations with a single, consistent component
 */

import { BadgeProps, LeadStatus } from '@/types';

const badgeVariants = {
  status: {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    called: 'bg-gray-100 text-gray-800 border-gray-200',
    booked: 'bg-green-100 text-green-800 border-green-200',
    callback: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    not_answered: 'bg-red-100 text-red-800 border-red-200',
    failed: 'bg-red-100 text-red-800 border-red-200'
  },
  outcome: {
    booked: 'bg-green-100 text-green-800 border-green-200',
    not_answered: 'bg-red-100 text-red-800 border-red-200',
    callback: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    busy: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  qualification: {
    qualified: 'bg-green-100 text-green-800 border-green-200',
    not_qualified: 'bg-red-100 text-red-800 border-red-200'
  },
  source: {
    landing_page: 'bg-blue-100 text-blue-800 border-blue-200',
    call_system: 'bg-gray-100 text-gray-800 border-gray-200',
    import: 'bg-purple-100 text-purple-800 border-purple-200',
    manual: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
};

const statusLabels = {
  new: 'New',
  called: 'Called',
  booked: 'Booked',
  callback: 'Callback',
  not_answered: 'Not Answered',
  failed: 'Failed',
  qualified: 'Qualified',
  not_qualified: 'Not Qualified',
  landing_page: 'Landing Page',
  call_system: 'Call System',
  import: 'Import',
  manual: 'Manual'
};

export function Badge({ status, variant, className = '' }: BadgeProps) {
  const variantStyles = badgeVariants[variant];
  const statusStyle = variantStyles[status as keyof typeof variantStyles];
  const label = statusLabels[status as keyof typeof statusLabels] || status;
  
  if (!statusStyle) {
    console.warn(`Invalid badge status: ${status} for variant: ${variant}`);
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 ${className}`}>
        {label}
      </span>
    );
  }
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusStyle} ${className}`}>
      {label}
    </span>
  );
}

// Specialized badge components for common use cases
export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return <Badge status={status} variant="status" className={className} />;
}

export function QualificationBadge({ qualified, className }: { qualified: boolean; className?: string }) {
  return (
    <Badge 
      status={qualified ? 'qualified' : 'not_qualified'} 
      variant="qualification" 
      className={className} 
    />
  );
}

export function SourceBadge({ source, className }: { source: string; className?: string }) {
  return <Badge status={source} variant="source" className={className} />;
}